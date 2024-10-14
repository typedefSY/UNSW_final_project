use std::fmt::{Debug, Display, Formatter};

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, PartialEq)]
pub enum TsType {
    Basic(String),
    Array(Box<TsType>),
    Map(Box<TsType>, Box<TsType>),
    Union(Vec<TsType>),
}

impl Debug for TsType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let pretty_json = serde_json::to_string_pretty(&self).unwrap();
        write!(f, "{}", pretty_json)
    }
}

impl Display for TsType {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        let compact_json = serde_json::to_string(&self).unwrap();
        write!(f, "{}", compact_json)
    }
}
