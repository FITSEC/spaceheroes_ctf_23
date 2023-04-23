use std::io;
fn magrathea (x: u128) -> String{
    let ret = format!("{}", ((x<<(1+(x%3))*3))+x);
    return ret.chars().rev().collect::<String>();
}
fn main() {
    println!("input an int ");
    let mut input = String::new();
    io::stdin().read_line(&mut input).expect("err 1");
    let number: u128 = input.trim().parse().expect("err 2");
    println!("here's you'r anwser - {}", magrathea(number));
}

