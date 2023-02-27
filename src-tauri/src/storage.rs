use std::fs::{self};

use serde::{Serialize, Deserialize};
use serde_json::json;

#[derive(Serialize, Deserialize, Debug)]
pub struct Account {
  phone: String,
  remark: String
}

const DB_SAVE_PATH: &str = "a.json";

pub fn get_accounts() -> Vec<Account> {
  let rf = fs::read_to_string(DB_SAVE_PATH);
  if let Ok(f) = rf {
    
    let accounts: Vec<Account> = serde_json::from_str(f.as_str()).unwrap();
    return accounts;
  } else {
    return vec![];
  }
}

pub fn save_accounts(accounts: Vec<Account>) -> bool {
  let str = json!(accounts);
  let rw = fs::write(DB_SAVE_PATH, str.to_string());
  if let Ok(_) = rw {
    return true;
  }
  return false;
}