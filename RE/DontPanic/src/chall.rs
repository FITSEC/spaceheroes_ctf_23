// input an int
// 9759843758294251095324759324578435
// here's you'r anwser - 5517378053351061091180594008489976005
//
use std::io;
fn magrathea (x: u128) -> String{
    println!("you are currently deep inside the non-esistant function magrathea");
    let h = format!("{}", ((x<<(1+(x%3))*3))+x);
    return h.chars().rev().collect::<String>();
}
fn main() {
    println!("ow, no youre turrning into a penguin, find the improbobility level of this event");
    let mut i = String::new();
    io::stdin().read_line(&mut i).expect("you've got to accept it you know, this bypass has got to be built and its going to be built");
    let num1: u128 = i.trim().parse().expect("this error message might be the only sensible thing you here all-day");
    
    if magrathea(num1).eq("5517378053351061091180594008489976005") {
        std::fs::read_to_string("flag.txt").unwrap().lines().for_each(|line| println!("{}", line));
    } else {
        println!("Curiously enough, the only thing that went through the mind of the bowl of petunias as it fell was Oh no, not again");
        println!("Many people have speculated that if we knew exactly why the bowl of petunias had thought that we would know a lot more about the nature of the binary reverse engineering than we do now.")
    }
}
