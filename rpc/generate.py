import typing as t
import os
import re
import sys
import yaml
from rpctypes import Model, TypeMap, TypeDef, Object, Endpoint
from rich.console import Console
import tstype_py as tstype
import json
from rich.markdown import Markdown

console = Console()

# Basic TypeScript types

TypescriptMap: TypeMap = {
    "string": "string",
    "int": "number",
    "float": "number",
    "boolean": "boolean",
    "any": "any",
    "null": "null",
    "json": "any",
}


class ModelCheckerContext:
    errors: list[str]
    warnings: list[str]

    def __init__(self) -> None:
        self.errors = []
        self.warnings = []

    def add_error(self, error: str):
        self.errors.append(error)

    def add_warning(self, warning: str):
        self.warnings.append(warning)


class TypescriptTypeCompilerV2:
    model: Model
    buildin_types: list[str] = ["string", "number", "boolean", "any", "null"]

    def __init__(self, model: Model) -> None:
        self.model = model
        self.types: list[str] = []
        self.names: list[str] = []
        self.trees: list[dict] = []

    def add_type(self, name: str, content: TypeDef, check_only: bool = False):
        if content is None:
            return
        if isinstance(content, dict):
            for key, value in content.items():
                self.add_type(key, value, True)
        else:
            try:
                self.trees.append(json.loads(
                    tstype.parse_type_definition(content)))
            except Exception as e:
                code = Markdown(f"""
```ts
{name}: {content}
```
""")
                console.print(code)
                raise ValueError(f"^Syntax Error: {e}")
            self.types.append(content)

        if not check_only:
            if not self.is_valid_identifier(name):
                raise ValueError(f"Invalid identifier {name}")
            self.names.append(name)
        else:
            if not self.is_valid_optional_identifier(name):
                raise ValueError(f"Invalid identifier {name}")

    def check_types(self):
        type_defined = set()

        def check_type(tree):
            t = list(tree.keys())[0]
            if t == 'Basic':
                type_defined.add(tree['Basic'])
                return
            if t == 'Array':
                check_type(tree['Array'])
            if t == 'Map':
                check_type(tree['Map'][0])
                check_type(tree['Map'][1])
            if t == 'Union':
                for sub_tree in tree['Union']:
                    check_type(sub_tree)

        for tree in self.trees:
            check_type(tree)

        all_types = set(
            [t for t in self.names + list(TypescriptMap.keys()) if self.is_valid_identifier(t)])
        type_not_defined = [
            type_name for type_name in type_defined if type_name not in all_types]
        if type_not_defined:
            raise ValueError(
                f"Types not defined: {', '.join(type_not_defined)}")

    def is_valid_identifier(self, identifier: str) -> bool:
        identifier_regex = re.compile(r"^[a-zA-Z_]\w*$")

        if not identifier_regex.match(identifier):
            return False
        return True

    def is_valid_optional_identifier(self, identifier: str) -> bool:
        identifier_regex = re.compile(r"^[a-zA-Z_]\w*[a-zA-Z0-9\?]$")

        if not identifier_regex.match(identifier):
            return False
        return True

    def parse_field(self, key: str, value: TypeDef) -> str:
        return f"{key}: {self.format(value)};"

    def parse_root_object(self, name: str, definition: Object) -> str:
        if definition is None:
            definition = {}
        fields = [self.parse_field(key, value)
                  for key, value in definition.items()]
        return f"export interface {name} {{\n    " + "\n    ".join(fields) + "\n}"

    def parse_root(self, name: str, definition: TypeDef):
        if isinstance(definition, str):
            return f"export type {name} = {self.format(definition)};"
        elif isinstance(definition, dict):
            return self.parse_root_object(name, definition)
        else:
            raise TypeError(
                f"Invalid type definition for {name}: {definition} is unexpected.")

    def to_big_camel_case(self, name: str) -> str:
        return name[0].upper() + name[1:]

    def generate_api_error(self):
        return '''export class APIError extends Error {
    public code?: string;
    constructor(message: string, code?: string) {
        super(message);
        this.code = code;
    }
}

// eslint-disable-next-line
export const isAPIError = (e: any): e is APIError => {
    // eslint-disable-next-line
    return e instanceof APIError || !!e._rpc_error;
}
'''

    def simple_format(self, content: str) -> str:
        content = content.replace(' ', '')
        content = content.replace(',', ', ')
        content = content.replace('|', ' | ')
        return content

    # func: str -> str
    @staticmethod
    def transform_basic_in_tree(d: dict | list, func: t.Callable):
        if isinstance(d, dict):
            for key in list(d.keys()):
                if key == 'Basic':
                    d[key] = func(d[key])
                else:
                    TypescriptTypeCompilerV2.transform_basic_in_tree(
                        d[key], func)
        elif isinstance(d, list):
            for item in d:
                TypescriptTypeCompilerV2.transform_basic_in_tree(item, func)
        return d

    def format(self, content: str) -> str:
        try:
            tree = json.loads(tstype.parse_type_definition(content))
            tree = TypescriptTypeCompilerV2.transform_basic_in_tree(
                tree,
                lambda x: TypescriptMap[x] if x in TypescriptMap.keys() else x
            )
            return self.simple_format(tstype.build_type_definition(json.dumps(tree)))
        except Exception as e:
            code = Markdown(f"""
```ts
{content}
```
""")
            console.print(code)
            raise ValueError(f"^Format Failed: {e}")

    def parse(self):
        if self.model["types"] is None:
            self.model['types'] = {}
        for key, value in self.model["types"].items():
            self.add_type(key, value)
        for endpoints in self.model["endpoints"].values():
            if endpoints["request"] is None:
                continue
            for key, value in endpoints["request"].items():
                self.add_type(key, value, True)
            if endpoints["response"] is None:
                continue
            for key, value in endpoints["response"].items():
                self.add_type(key, value, True)
        self.check_types()
        types_def = '\n\n'.join([self.parse_root(key, value)
                                 for key, value in self.model["types"].items()])

        # Now, parse the types for the endpoints
        endpoints = self.model["endpoints"]

        endpoint_types_def = ''

        for name, endpoint in endpoints.items():
            request = self.parse_root_object(
                self.to_big_camel_case(name + "Request"), endpoint["request"])

            response = self.parse_root_object(
                self.to_big_camel_case(name + "Response"), endpoint["response"])

            endpoint_types_def += f'''
// {self.to_big_camel_case(name)}Request is the request that is sent to the {name} endpoint.
{request}

// {self.to_big_camel_case(name)}Response is the response that is sent to the {name} endpoint.
{response}
'''

        return f'''//////////////////////////////
// Types defined in the types file
//////////////////////////////

{types_def}

//////////////////////////////
// Endpoint Requests/Responses
//////////////////////////////

{endpoint_types_def}

//////////////////////////////
// API Errors
//////////////////////////////

{self.generate_api_error()}
'''


class TypescriptTypeCompiler:
    model: Model

    def __init__(self, model: Model) -> None:
        self.model = model

    def parse_type_name(self, name: str) -> str:
        if name in TypescriptMap:
            return TypescriptMap[name]
        if name in self.model["types"]:
            return name
        raise TypeError(f"Type {name} not found")

    def is_array(self, type_ref: str) -> tuple[bool, str]:
        arr_regex = re.compile(r"^(.+)\[\]$")
        mat = arr_regex.match(type_ref)

        if mat:
            return (True, mat.group(1))

        return (False, type_ref)

    def make_array(self, type_ref: str):
        return f"{type_ref}[]"

    def is_map(self, type_ref: str) -> tuple[bool, str, str]:
        obj_regex = re.compile(r"^Record<(.+),\s*(.+)>$")
        mat = obj_regex.match(type_ref)

        if mat:
            return (True, mat.group(1), mat.group(2))
        return (False, type_ref, type_ref)

    def make_map(self, key: str, value: str):
        return f"Record<{key}, {value}>"

    def is_union(self, type_ref: str) -> tuple[bool, str, str]:
        obj_regex = re.compile(r"^(.*)\s*\|\s*(.*)$")
        mat = obj_regex.match(type_ref)

        if mat:
            return (True, mat.group(1), mat.group(2))
        return (False, type_ref, type_ref)

    def make_union(self, type_ref1: str, type_ref2: str):
        return f"{type_ref1} | {type_ref2}"

    def parse_type_ref(self, name: str) -> str:
        name = name.strip()

        is_arr, rest = self.is_array(name)

        if is_arr:
            return self.make_array(self.parse_type_ref(rest))

        is_map, key, value = self.is_map(rest)

        if is_map:
            return self.make_map(self.parse_type_ref(key), self.parse_type_ref(value))

        is_union, u1, u2 = self.is_union(rest)

        if is_union:
            return self.make_union(self.parse_type_ref(u1), self.parse_type_ref(u2))

        if self.is_valid_identifier(name):
            return self.parse_type_name(name)

        # If it's definitely not an array
        raise TypeError(f'Unrecognised syntax: {name}')

    def is_valid_identifier(self, identifier: str) -> bool:
        identifier_regex = re.compile(r"^[a-zA-Z_]\w*$")

        if not identifier_regex.match(identifier):
            return False
        return True

    def is_optional_field(self, key: str) -> t.Tuple[bool, str]:
        obj_regex = re.compile(r"^(.+)\?$")
        mat = obj_regex.match(key)

        if mat:
            return (True, mat.group(1))
        return (False, key)

    def parse_field(self, key: str, value: TypeDef) -> str:
        is_optional, key = self.is_optional_field(key)

        if is_optional:
            return f"{key}?: {self.parse_type_ref(value)};"

        return f"{key}: {self.parse_type_ref(value)};"

    def parse_object(self, definition: Object) -> str:
        fields = [self.parse_field(key, value)
                  for key, value in definition.items()]
        return "{\n" + "\n    ".join(fields) + "\n}"

    def parse_root_object(self, name: str, definition: Object) -> str:
        if definition is None:
            definition = {}

        fields = [self.parse_field(key, value)
                  for key, value in definition.items()]
        return f"export interface {name} {{\n    " + "\n    ".join(fields) + "\n}"

    def parse_root(self, name: str, definition: TypeDef):
        if not self.is_valid_identifier(name):
            raise TypeError(f"Invalid identifier {name}")

        if isinstance(definition, str):
            return f"export type {name} = {self.parse_type_ref(definition)};"
        elif isinstance(definition, dict):
            return self.parse_root_object(name, definition)
        else:
            raise TypeError(
                f"Invalid type definition for {name}: {definition} is unexpected.")

    def to_big_camel_case(self, name: str) -> str:
        return name[0].upper() + name[1:]

    def generate_api_error(self):
        return '''export class APIError extends Error {
    public code?: string;
    constructor(message: string, code?: string) {
        super(message);
        this.code = code;
    }
}

// eslint-disable-next-line
export const isAPIError = (e: any): e is APIError => {
    // eslint-disable-next-line
    return e instanceof APIError || !!e._rpc_error;
}
'''

    def parse(self):
        if self.model["types"] is None:
            self.model['types'] = {}

        types_def = '\n\n'.join([self.parse_root(key, value)
                                 for key, value in self.model["types"].items()])

        # Now, parse the types for the endpoints
        endpoints = self.model["endpoints"]

        endpoint_types_def = ''

        for name, endpoint in endpoints.items():
            request = self.parse_root_object(
                self.to_big_camel_case(name + "Request"), endpoint["request"])

            response = self.parse_root_object(
                self.to_big_camel_case(name + "Response"), endpoint["response"])

            endpoint_types_def += f'''
// {self.to_big_camel_case(name)}Request is the request that is sent to the {name} endpoint.
{request}

// {self.to_big_camel_case(name)}Response is the response that is sent to the {name} endpoint.
{response}
'''

        return f'''//////////////////////////////
// Types defined in the types file
//////////////////////////////

{types_def}

//////////////////////////////
// Endpoint Requests/Responses
//////////////////////////////

{endpoint_types_def}

//////////////////////////////
// API Errors
//////////////////////////////

{self.generate_api_error()}
'''


TypescriptTypeCompiler = TypescriptTypeCompilerV2


class ClientRequesterCompiler:
    model: Model
    tc: TypescriptTypeCompiler

    def __init__(self, model: Model, tc: TypescriptTypeCompiler, base_url: str = 'api') -> None:
        self.model = model
        self.tc = tc
        self.base_url = base_url if not base_url.endswith(
            '/') else base_url[:-1]

    def parse_endpoint(self, name: str) -> str:
        request_type_name = self.tc.to_big_camel_case(name + "Request")
        response_type_name = self.tc.to_big_camel_case(name + "Response")

        rpc_requester = f'''
    async {name}(request: {request_type_name}): Promise<{response_type_name}> {{
        const response = await fetch(`${{this.base_url}}/{name}`, {{
            method: 'POST',
            headers: {{
                'Content-Type': 'application/json'
            }},
            body: JSON.stringify(request)
        }});

        const json = await response.json();

        if (!response.ok) {{
            let err = new Error("RPC Request Failed.");

            if (isAPIError(json)) {{
                switch (response.status) {{
                    case 400:
                        err = new APIError(json.message, json.code);
                        break;
                    case 500:
                        err = new Error(json.message);
                        break;
                }}
            }}

            if (this.on_error) {{
                this.on_error(err);
            }}

            throw err;
        }}

        return json as {response_type_name};
    }}
'''
        return rpc_requester

    def parse(self, name: str):
        endpoints = '\n\n'.join([
            self.parse_endpoint(name) for name in self.model["endpoints"].keys()
        ])

        return f'''// Generated by the RPC compiler.
// DO NOT EDIT.

{self.tc.parse().strip()}

export class {self.tc.to_big_camel_case(name)}Client {{
    private base_url: string;
    private on_error?: (e: Error) => void;

    constructor(base_url: string, on_error?: (e: Error) => void) {{
        this.base_url = base_url;
        this.on_error = on_error ?? ((e: Error) => {{
            console.error('Error occurred during RPC request:', e);
        }})
    }}

    captured(on_error: (e: Error) => void) {{
        return new {self.tc.to_big_camel_case(name)}Client(this.base_url, on_error);
    }}

    {endpoints.strip()}
}}

export const {name}API = new {self.tc.to_big_camel_case(name)}Client('{self.base_url}');
'''


# Abstract service class.
class Service:
    name: str
    model: Model

    def __init__(self, name: str) -> None:
        self.name = name

    def load_model(self, model: Model):
        self.model = model

    def get_name(self) -> str:
        return self.name

    def reset(self):
        raise NotImplementedError()

    def add_endpoint(self, name: str, endpoint: Endpoint):
        raise NotImplementedError()

    def compile(self):
        raise NotImplementedError()


class TypescriptService(Service):
    buf: str
    tc: TypescriptTypeCompiler
    functions: t.Dict[str, str]

    root: str
    src_dir: str
    out_dir: str

    base: str

    def __init__(self, name: str, root: str, src_dir: str, out_dir: str, base: str = '') -> None:
        '''
        Look for functions in the src, and output files to out.
        When importing, omit the root and replace with @.
        '''

        self.root = os.path.abspath(root)
        self.src_dir = os.path.abspath(src_dir)
        self.out_dir = os.path.abspath(out_dir)
        self.base = base

        super().__init__(name)
        self.buf = ''

    def calculate_import_path(self, path: str) -> str:
        root_path = self.root if self.root[-1] == '/' else self.root + '/'

        if path.startswith(root_path):
            path = '@/' + path[len(root_path):]

        if path.endswith('.ts'):
            path = path[:-3]
        elif path.endswith('.tsx'):
            path = path[:-4]

        return path

    def parse_functions_from_file(self, file: str):
        with open(file, 'r') as f:
            content = f.read()

        regex_func_syntax = re.compile(
            r'export\s+(async\s+)?function\s+([a-zA-Z]\w*)\s*\(')
        regex_export_syntax = re.compile(
            r'export\s+const\s+([a-zA-Z]\w*)\s*(:[^=]*)?=\s*(async\s+)?\(')

        function_names = []

        # Find all matches
        for m in regex_func_syntax.finditer(content):
            function_names.append(m.group(2))
        for m in regex_export_syntax.finditer(content):
            function_names.append(m.group(1))

        return function_names

    def scan_functions(self):
        def scan(dir):
            for root, dirs, files in os.walk(dir):
                for file in files:
                    if not file.endswith('.ts') and not file.endswith('.tsx'):
                        continue

                    funs = self.parse_functions_from_file(
                        os.path.join(root, file))

                    for fun in funs:
                        if fun in self.functions:
                            raise ValueError(
                                f"Duplicate definition of {fun} found in {self.functions[fun]} and {os.path.join(root, file)}.")

                        self.functions[fun] = self.calculate_import_path(
                            os.path.join(root, file)
                        )

        scan(self.src_dir)

    def load_model(self, model: Model):
        self.tc = TypescriptTypeCompiler(model)
        return super().load_model(model)

    def reset(self):
        self.buf = ''
        self.functions = {}
        self.scan_functions()

    def generate_implementation_stub(self, name: str, endpoint: Endpoint):
        request_type_name = self.tc.to_big_camel_case(
            name + "Request")
        response_type_name = self.tc.to_big_camel_case(
            name + "Response")

        return f'''import {{ {request_type_name}, {response_type_name} }} from "{self.calculate_import_path(self.out_dir)}";

// {name} implements the {name} endpoint.
// This code has been automatically generated.
// You can move this function to other files within the {self.src_dir} directory,
// as long as the signature remains the same and the function is exported.
export const {name} = async (ctx: any, request: {request_type_name}{', req: Request, res: Response' if endpoint.get("raw") else ""}): Promise<{response_type_name}> => {{
    throw new Error('Not implemented');
}}'''

    def generate_endpoint_connector(self, name: str, endpoint: Endpoint):
        return f'''// {name} is the endpoint handler for the {name} endpoint.
// It wraps around the function at {self.functions[name]}.
app.post('{self.base}/{name}', async (req, res) => {{
    const request: {self.tc.to_big_camel_case(name + "Request")} = req.body;
    try {{
        const ctx = {{ req, res }};
        const response: {self.tc.to_big_camel_case(name + "Response")} = await {name}(ctx, request);
        res.json(response);
    }} catch (e) {{
        if (e instanceof APIError) {{
            res.status(400);
            res.json({{ message: e.message, code: e.code, _rpc_error: true }});
            return;
        }} else {{
            res.status(500);
            res.json({{ message: "Internal server error", _rpc_error: true }});
            console.error(`Error occurred while handling request {name} with arguments ${{ JSON.stringify(request) }}: `, e);
            return;
        }}
    }}
}});'''

    def error_no_implementation(self, name: str):
        return f'Cannot find an implementation for {name}. Make sure that this \
function is defined in one of the .ts/.tsx files in {self.src_dir} (available \
functions: {", ".join([n for n in self.functions.keys()])}).'

    def add_endpoint(self, name: str, endpoint: Endpoint):
        if name not in self.functions:
            # print(self.error_no_implementation(name), file=sys.stderr)

            impl_stub_out = os.path.join(self.src_dir, f'{name}.ts')

            with open(impl_stub_out, 'a') as f:
                f.write(self.generate_implementation_stub(name, endpoint))
                self.functions[name] = self.calculate_import_path(
                    impl_stub_out)
            console.print(
                f'Generated stub for {name} at {impl_stub_out}', style="green")

        self.buf += self.generate_endpoint_connector(name, endpoint) + '\n\n'

    def calculate_imports(self):
        files_map = {}
        out = ""
        for fun, file in self.functions.items():
            if fun not in self.model["endpoints"]:
                console.print(
                    f"Warning: Unwired handler found '{fun}' (at '{self.functions[fun]}'). Add an endpoint in the model to wire it up.", style="yellow")
                continue
            if file not in files_map:
                files_map[file] = []
            files_map[file].append(fun)

        for file, funs in files_map.items():
            out += f'import {{ {", ".join(funs)} }} from "{file}";\n'

        return out

    def compile(self):
        out = '// Generated by the RPC compiler. DO NOT EDIT.\n\n'
        # Imports
        out += '''
import { app } from "@/globals";
'''
        out += self.calculate_imports()
        out += self.tc.parse()
        out += self.buf

        if not os.path.exists(self.out_dir):
            raise ValueError(
                f"Output directory {self.out_dir} does not exist.")

        with open(os.path.join(self.out_dir, 'index.ts'), 'w') as f:
            f.write(out)


class ServerWiring:
    model: Model
    services: t.Dict[str, Service]

    def __init__(self, model: Model, services: t.List[Service]) -> None:
        self.model = model
        self.services = {service.get_name(): service for service in services}

        for service in services:
            service.load_model(model)

    def compile(self):
        for srv in self.services.values():
            srv.reset()

        used_service = set()

        for name, endpoint in self.model['endpoints'].items():
            if endpoint['service'] not in self.services:
                raise ValueError(f"Service {endpoint['service']} not found")

            used_service.add(endpoint['service'])
            self.services[endpoint['service']].add_endpoint(name, endpoint)

        for srv in used_service:
            self.services[srv].compile()


USAGE = f'''Usage: {sys.argv[0]} <model> <mode> [mode-specific arguments]

<mode> can be one of:
- client: Generate a TypeScript client
- ts-server: Generate a typescript express-based server

If <mode> is client, the following arguments are required:
- <out_dir>: The output directory. The client will be generated in <out_dir>/index.ts
- <name>: The name of the client
- <base_url>: The base URL of the server

If <mode> is ts-server, the following arguments are required:
- <root>: The src/ directory of the server
- <src_dir>: The source directory in which endpoint implementations are located
- <out_dir>: The output directory. The server will be generated in <out_dir>/index.ts
- <base>: The base URL of the server
'''


def main():
    if len(sys.argv) < 2:
        console.print(USAGE, soft_wrap=True)
        sys.exit(1)

    with open(sys.argv[1], 'r') as file:
        model: Model = yaml.safe_load(file)

    if sys.argv[2] == 'client':
        if len(sys.argv) < 6:
            console.print(USAGE, soft_wrap=True)
            sys.exit(1)

        out_dir = sys.argv[3]
        name = sys.argv[4]
        base_url = sys.argv[5]

        tc = TypescriptTypeCompiler(model)
        cc = ClientRequesterCompiler(model, tc, base_url)

        with open(os.path.join(out_dir, 'index.ts'), 'w') as f:
            f.write(cc.parse(name))
        console.print(
            f'Generated client for {name} at {os.path.join(out_dir, "index.ts")}', style="green"
        )
        exit(0)

    if sys.argv[2] == 'ts-server':
        if len(sys.argv) < 7:
            console.print(USAGE, soft_wrap=True)
            sys.exit(1)

        root = sys.argv[3]
        src_dir = sys.argv[4]
        out_dir = sys.argv[5]
        base = sys.argv[6]

        wire = ServerWiring(model, [
            TypescriptService('typescript', root, src_dir, out_dir, base)
        ])
        wire.compile()
        console.print(f'Generated ts-server at {out_dir}', style="green")
        exit(0)


try:
    main()
except Exception as e:
    console.print(e, style="red")
    sys.exit(1)
