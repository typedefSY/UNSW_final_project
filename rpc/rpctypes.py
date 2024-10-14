import typing as t

# How are things represented in the model?
Primitive = str
Object = t.Dict[str, Primitive]

TypeDef = t.Union[Object, Primitive]


class Endpoint(t.TypedDict):
    request: Object
    response: Object
    service: str


class Model(t.TypedDict):
    types: t.Dict[str, TypeDef]
    endpoints: t.Dict[str, Endpoint]


TypeMap = t.Mapping[str, str]
