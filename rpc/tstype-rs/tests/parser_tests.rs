extern crate tstype_rs;
use tstype_rs::ast::TsType;
use tstype_rs::parser::parse;

#[test]
fn test_parse_error() {
    let text = "Hello, World!";
    let result = parse(text);
    assert!(result.is_none());
}

#[test]
fn test_parse_basic() {
    let text = "User";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(result.unwrap(), TsType::Basic("User".to_string()));
}

#[test]
fn test_parse_basic_with_spaces() {
    let text = " User ";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(result.unwrap(), TsType::Basic("User".to_string()));
}

#[test]
fn test_parse_basic_with_invalid_characters() {
    let text = " User! ";
    let result = parse(text);
    assert!(result.is_none());
}

#[test]
fn test_parse_basic_with_spacial_characters() {
    let text = "Record";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(result.unwrap(), TsType::Basic("Record".to_string()));
    let text = "Array";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(result.unwrap(), TsType::Basic("Array".to_string()));
}

#[test]
fn test_parse_array_suffix() {
    let text = "User[]";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Array(Box::new(TsType::Basic("User".to_string())))
    );
}

#[test]
fn test_parse_array_suffix_with_spaces() {
    let text = " User [] ";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Array(Box::new(TsType::Basic("User".to_string())))
    );
}

#[test]
fn test_parse_array_suffix_with_missing_characters() {
    let text = " User[ ";
    let result = parse(text);
    assert!(result.is_none());
}

#[test]
fn test_parse_array_suffix_with_invalid_characters() {
    let text = " User! [] ";
    let result = parse(text);
    assert!(result.is_none());
}

#[test]
fn test_parse_array_suffix_with_spacial_characters() {
    let text = "Map[]";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Array(Box::new(TsType::Basic("Map".to_string())))
    );
    let text = "Array[]";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Array(Box::new(TsType::Basic("Array".to_string())))
    );
}

#[test]
fn test_parse_array_suffix_with_recursive() {
    let text = "User[][]";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Array(Box::new(TsType::Array(Box::new(TsType::Basic(
            "User".to_string()
        )))))
    );
}

#[test]
fn test_parse_array_suffix_with_union_inside() {
    let text = "(User | string)[]";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Array(Box::new(TsType::Union(vec![
            TsType::Basic("User".to_string()),
            TsType::Basic("string".to_string())
        ])))
    );
}

#[test]
fn test_parse_array_generic() {
    let text = "Array<User>";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Array(Box::new(TsType::Basic("User".to_string())))
    );
}

#[test]
fn test_parse_array_generic_with_missing_characters() {
    let text = " Array<User";
    let result = parse(text);
    assert!(result.is_none());
}

#[test]
fn test_parse_array_generic_with_invalid_characters_inside() {
    let text = " Array<User!> ";
    let result = parse(text);
    assert!(result.is_none());
}

#[test]
fn test_parse_array_generic_with_invalid_characters_outside() {
    let text = "Array!<User>";
    let result = parse(text);
    assert!(result.is_none());
}

#[test]
fn test_parse_array_generic_with_wrong_characters() {
    let text = " Array<User) ";
    let result = parse(text);
    assert!(result.is_none());
}

#[test]
fn test_parse_array_generic_with_recursive_g_array() {
    let text = "Array<Array<User>>";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Array(Box::new(TsType::Array(Box::new(TsType::Basic(
            "User".to_string()
        )))))
    );
}

#[test]
fn test_parse_array_generic_with_recursive_s_array() {
    let text = "Array<User>[]";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Array(Box::new(TsType::Array(Box::new(TsType::Basic(
            "User".to_string()
        )))))
    );
    let test = "Array<User[]>[]";
    let result = parse(test);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Array(Box::new(TsType::Array(Box::new(TsType::Array(Box::new(
            TsType::Basic("User".to_string())
        ))))))
    );
}

#[test]
fn test_parse_array_generic_with_union_inside() {
    let text = "Array<User | string>";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Array(Box::new(TsType::Union(vec![
            TsType::Basic("User".to_string()),
            TsType::Basic("string".to_string())
        ])))
    );
}

#[test]
fn test_parse_map_generic() {
    let text = "Record<string, User>";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Map(
            Box::new(TsType::Basic("string".to_string())),
            Box::new(TsType::Basic("User".to_string()))
        )
    );
}

#[test]
fn test_parse_map_generic_with_missing_characters_outside() {
    let text = " Record<string, User ";
    let result = parse(text);
    assert!(result.is_none());
}

#[test]
fn test_parse_map_generic_with_missing_characters_inside() {
    let text = " Record<string User> ";
    let result = parse(text);
    assert!(result.is_none());
}

#[test]
fn test_parse_map_generic_with_inside_more_than_two() {
    let text = "Record<string, User, string>";
    let result = parse(text);
    assert!(result.is_none());
}

#[test]
fn test_parse_map_generic_with_invalid_characters_inside() {
    let text = "Record<string, User!>";
    let result = parse(text);
    assert!(result.is_none());
}

#[test]
fn test_parse_map_generic_with_invalid_characters_outside() {
    let text = "Record!<string,User>";
    let result = parse(text);
    assert!(result.is_none());
}

#[test]
fn test_parse_map_generic_with_wrong_characters() {
    let text = "Record[string, User>";
    let result = parse(text);
    assert!(result.is_none());
}

#[test]
fn test_parse_map_generic_with_recursive_map() {
    let text = "Record<string, Record<number, User>>";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Map(
            Box::new(TsType::Basic("string".to_string())),
            Box::new(TsType::Map(
                Box::new(TsType::Basic("number".to_string())),
                Box::new(TsType::Basic("User".to_string()))
            ))
        )
    );
}

#[test]
fn test_parse_map_generic_with_recursive_g_array() {
    let text = "Record<string, Array<User>>";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Map(
            Box::new(TsType::Basic("string".to_string())),
            Box::new(TsType::Array(Box::new(TsType::Basic("User".to_string()))))
        )
    );
}

#[test]
fn test_parse_map_generic_with_recursive_s_array() {
    let text = "Record<string, Array<User>[]>";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Map(
            Box::new(TsType::Basic("string".to_string())),
            Box::new(TsType::Array(Box::new(TsType::Array(Box::new(
                TsType::Basic("User".to_string())
            )))))
        )
    );
}

#[test]
fn test_parse_union() {
    let text = "User | Record<string, User>";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Union(vec![
            TsType::Basic("User".to_string()),
            TsType::Map(
                Box::new(TsType::Basic("string".to_string())),
                Box::new(TsType::Basic("User".to_string()))
            )
        ])
    );
}

#[test]
fn test_parse_union_with_multiple_unions() {
    let text = "User | Record<string, User> | Array<User>";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Union(vec![
            TsType::Basic("User".to_string()),
            TsType::Map(
                Box::new(TsType::Basic("string".to_string())),
                Box::new(TsType::Basic("User".to_string()))
            ),
            TsType::Array(Box::new(TsType::Basic("User".to_string())))
        ])
    );
}

#[test]
fn test_parse_union_with_recursive() {
    let text = "User | Record<string, User | string> | Array<User>[]";
    let result = parse(text);
    assert!(result.is_some());
    assert_eq!(
        result.unwrap(),
        TsType::Union(vec![
            TsType::Basic("User".to_string()),
            TsType::Map(
                Box::new(TsType::Basic("string".to_string())),
                Box::new(TsType::Union(vec![
                    TsType::Basic("User".to_string()),
                    TsType::Basic("string".to_string())
                ]))
            ),
            TsType::Array(Box::new(TsType::Array(Box::new(TsType::Basic(
                "User".to_string()
            )))))
        ])
    );
}

#[test]
fn test_parse_realcase() {
    let test = "string|Record<string,Record<number| string|Something, Array<string[][][] | Record<string|number, User[]>>>[][]>[] | number[] | string";
    let result = parse(test);
    assert!(result.is_some());
    assert_eq!(result.unwrap().to_string(), "{\"Union\":[{\"Basic\":\"string\"},{\"Array\":{\"Map\":[{\"Basic\":\"string\"},{\"Array\":{\"Array\":{\"Map\":[{\"Union\":[{\"Basic\":\"number\"},{\"Basic\":\"string\"},{\"Basic\":\"Something\"}]},{\"Array\":{\"Union\":[{\"Array\":{\"Array\":{\"Array\":{\"Basic\":\"string\"}}}},{\"Map\":[{\"Union\":[{\"Basic\":\"string\"},{\"Basic\":\"number\"}]},{\"Array\":{\"Basic\":\"User\"}}]}]}}]}}}]}},{\"Array\":{\"Basic\":\"number\"}},{\"Basic\":\"string\"}]}");
}
