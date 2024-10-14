import tstype_py as ts
import json

text = "Record<string,Record<number| string|Something, Array<string[][][] | Record<string|number, User[]>>>[][]>[] | number[] | string"
d = json.loads(ts.parse_type_definition(text))
print(d)
