use tstype_rs::builder::build;
use tstype_rs::parser::parse;

fn main() {
    let text = "(string|Array<string|number>|number)[] | Record<string,Record<number| string|Something, Array<string[][][] | Record<string|number, (string|Array<string|number>|number)[]>>>[][]>[] | number[] | string";
    println!("AST:\n{:?}", parse(text).unwrap());
    println!("TypeScript type:\n{}", build(parse(text).unwrap()));
}
