#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod storage;

use std::{thread, time::Duration};

use once_cell::sync::Lazy;
use storage::{Account, Storage};
use tauri::{Manager, Size, LogicalSize};
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
    let accounts = get_accounts();
    tauri::Builder::default()
        .setup(|app| {
            if accounts.len() != 0 {
                app.get_window("main").unwrap().close().unwrap();
                let handle = app.handle();
                for account in accounts {
                    let h = handle.clone();
                    std::thread::spawn(move || {
                        let phone = account.phone.clone();
                        let mut title = account.remark;
                        if title.is_empty() {
                            title = account.phone;
                        }
                        let jd = tauri::WindowBuilder::new(
                            &h,
                            "jd",
                            tauri::WindowUrl::External(
                                "https://plogin.m.jd.com/login/login".parse().unwrap(),
                            ),
                        )
                        .build()                        
                        .unwrap();
                        jd.set_title(title.as_str()).unwrap();
                        jd.set_size(Size::Logical(LogicalSize { width: 375.0, height: 667.0 })).unwrap();
                        let script = format!(r#"setTimeout(function() {{
                            console.log('inject')
                            var evt1 = new Event('input', {{
                                'bubbles': true,
                                'cancelable': true
                            }})
                            var ie=document.querySelector('.acc-input.mobile')
                            ie.value = '{}'
                            ie.dispatchEvent(evt1)
                            var evt2 = document.createEvent("HTMLEvents")
                            evt2.initEvent("change", false, true)
                            var ce = document.querySelector('.policy_tip-checkbox')
                            ce.checked = true
                            ce.dispatchEvent(evt2)
                            setTimeout(function() {{
                                document.querySelector('.getMsg-btn').click()
                            }}, 1000)
                        }}, 1800)"#, phone);
                        thread::sleep(Duration::from_secs(2));
                        // println!("{}", script);
                        jd.eval(&script).unwrap();
                        // TODO 后续没法监听到cookie
                    });
                }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_accounts, save_accounts])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
