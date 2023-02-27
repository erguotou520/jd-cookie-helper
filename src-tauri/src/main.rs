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
use storage::Account;

#[tauri::command]
fn get_accounts() -> Vec<Account> {
    storage::get_accounts()
}

#[tauri::command]
fn save_accounts(data: Vec<Account>) -> bool {
    storage::save_accounts(data)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_accounts, save_accounts])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
