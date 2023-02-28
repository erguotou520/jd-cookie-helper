#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

mod storage;
use storage::{Account,Storage};
use once_cell::sync::Lazy;

static STORAGE: Lazy<Storage> = Lazy::new(|| Storage::new());

#[tauri::command]
fn get_accounts() -> Vec<Account> {
    STORAGE.get_accounts()
}


#[tauri::command]
fn save_accounts(accounts: Vec<Account>) -> bool {
    STORAGE.save_accounts(accounts)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_accounts, save_accounts])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
