use std::fs::{self};

use serde::{Serialize, Deserialize};
use serde_json::json;
use std::path::{Path};
use dirs;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Account {
  pub phone: String,
  pub remark: String
}

pub struct Storage {
  db_save_path: String
}

impl Storage {
  pub fn new() -> Storage {
    let home_dir = dirs::home_dir().expect("Failed to get home directory");
    let dir_path = Path::new(&home_dir).join(".jd-cookie-helper");
    let db_path = dir_path.clone().join("db.json");
    if !dir_path.exists() {
      fs::create_dir(dir_path).unwrap();
    }
    // Join the home directory and ".jd-cookie-helper/db.json" path
    println!("path {}", db_path.to_str().unwrap());
    return Storage{
      db_save_path: db_path.to_str().unwrap().to_owned()
    }
  }

  pub fn get_accounts(&self) -> Vec<Account> {
    let rf = fs::read_to_string(self.db_save_path.clone());
    if let Ok(f) = rf {
      let accounts: Vec<Account> = serde_json::from_str(f.as_str()).unwrap();
      return accounts;
    } else {
      return vec![];
    }
  }

  pub fn save_accounts(&self, accounts: Vec<Account>) -> bool {
    let str = json!(accounts);
    let rw = fs::write(self.db_save_path.clone(), str.to_string());
    if let Ok(_) = rw {
      return true;
    }
    return false;
  }
}
