use pyo3::prelude::*;
use tstype_rs::ast::TsType;
use tstype_rs::builder::build;
use tstype_rs::parser::parse;

/// Parses a TypeScript type definition to json.
#[pyfunction]
fn parse_type_definition(input: &str) -> PyResult<String> {
    let result = parse(input);
    match result {
        Some(t) => Ok(t.to_string()),
        None => Err(PyErr::new::<pyo3::exceptions::PyValueError, _>(
            "Failed to parse type definition",
        )),
    }
}

/// Builds a TypeScript type definition from json.
#[pyfunction]
fn build_type_definition(input: &str) -> PyResult<String> {
    let deserialized: TsType = serde_json::from_str(input).map_err(|e| {
        PyErr::new::<pyo3::exceptions::PyValueError, _>(format!(
            "Failed to deserialize json: {}",
            e
        ))
    })?;
    Ok(build(deserialized))
}

/// A Python module implemented in Rust.
#[pymodule]
fn tstype_py(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(parse_type_definition, m)?)?;
    m.add_function(wrap_pyfunction!(build_type_definition, m)?)?;
    Ok(())
}
