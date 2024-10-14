use crate::ast::TsType;

pub fn build(ts_type: TsType) -> String {
    match ts_type {
        TsType::Basic(b) => b,
        TsType::Array(t) => match *t {
            TsType::Union(_) => format!("({})[]", build(*t)),
            _ => format!("{}[]", build(*t)),
        },
        TsType::Map(key_type, value_type) => {
            format!("Record<{}, {}>", build(*key_type), build(*value_type))
        }
        TsType::Union(types) => {
            let mut types_str: Vec<String> = types.into_iter().map(build).collect();
            types_str.sort_by_key(|t| std::cmp::Reverse(t.len()));
            types_str.join(" | ")
        }
    }
}
