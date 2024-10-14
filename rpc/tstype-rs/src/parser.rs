use crate::ast::TsType;
use regex::Regex;

fn parse_basic(text: &str) -> Option<TsType> {
    let text = text.trim();
    let re = Regex::new(r"^([a-zA-Z]*)$").unwrap();
    re.captures(text)
        .map(|caps| TsType::Basic(caps[1].to_string()))
}

fn parse_array_suffix(text: &str) -> Option<TsType> {
    let text = text.trim();
    let re = Regex::new(r"(.*)\[\]$").unwrap();
    match re.captures(text) {
        Some(caps) => {
            let inner = parse(&caps[1]);
            inner.map(|inner| TsType::Array(Box::new(inner)))
        }
        None => None,
    }
}

fn parse_array_suffix_brackets(text: &str) -> Option<TsType> {
    let text = text.trim();
    // (string|number)[]
    let re = Regex::new(r"^\((.*)\)\[\]$").unwrap();
    match re.captures(text) {
        Some(caps) => {
            let inner = parse(&caps[1]);
            inner.map(|inner| TsType::Array(Box::new(inner)))
        }
        None => None,
    }
}

fn parse_array_generic(text: &str) -> Option<TsType> {
    let text = text.trim();
    let re = Regex::new(r"^Array<(.*)>$").unwrap();
    match re.captures(text) {
        Some(caps) => {
            let inner = parse(&caps[1]);
            inner.map(|inner| TsType::Array(Box::new(inner)))
        }
        None => None,
    }
}

fn parse_map_generic(text: &str) -> Option<TsType> {
    let text = text.trim();
    let re = Regex::new(r"^Record<([a-zA-Z| ]*),(.*)>$").unwrap();
    match re.captures(text) {
        Some(caps) => {
            let key = parse(&caps[1]);
            let value = parse(&caps[2]);
            match key {
                Some(key) => value.map(|value| TsType::Map(Box::new(key), Box::new(value))),
                None => None,
            }
        }
        None => None,
    }
}

fn parse_union(text: &str) -> Option<TsType> {
    let text = text.trim();
    // find every | in text
    let indexs = text.match_indices('|').map(|(i, _)| i).collect::<Vec<_>>();
    for i in indexs {
        let left_text = text[..i].trim();
        let right_text = text[i + 1..].trim();
        if is_complete(left_text) && is_complete(right_text) {
            let left = parse(left_text);
            let right = parse(right_text);
            match left {
                Some(left) => {
                    match right {
                        Some(right) => {
                            // if the right is a union, merge it as a single union
                            if let TsType::Union(mut types) = right {
                                types.insert(0, left);
                                return Some(TsType::Union(types));
                            }
                            return Some(TsType::Union(vec![left, right]));
                        }
                        None => return None,
                    }
                }
                None => return None,
            }
        }
    }
    None
}

fn is_complete(text: &str) -> bool {
    let mut parentheses = 0;
    let mut square_brackets = 0;
    let mut angle_brackets = 0;
    for c in text.chars() {
        match c {
            '(' => parentheses += 1,
            ')' => parentheses -= 1,
            '[' => square_brackets += 1,
            ']' => square_brackets -= 1,
            '<' => angle_brackets += 1,
            '>' => angle_brackets -= 1,
            _ => {}
        }
        if parentheses < 0 || square_brackets < 0 || angle_brackets < 0 {
            return false;
        }
    }
    parentheses == 0 && square_brackets == 0 && angle_brackets == 0
}

pub fn parse(text: &str) -> Option<TsType> {
    let text = text.trim();

    let union = parse_union(text);
    if union.is_some() {
        return union;
    }

    let array_suffix_brackets = parse_array_suffix_brackets(text);
    if array_suffix_brackets.is_some() {
        return array_suffix_brackets;
    }

    let array_suffix = parse_array_suffix(text);
    if array_suffix.is_some() {
        return array_suffix;
    }

    let array_generic = parse_array_generic(text);
    if array_generic.is_some() {
        return array_generic;
    }

    let map_generic = parse_map_generic(text);
    if map_generic.is_some() {
        return map_generic;
    }

    let basic = parse_basic(text);
    if basic.is_some() {
        return basic;
    }

    None
}
