const cancel_button = document.getElementById('cancel_button');
const confirm_button = document.getElementById('confirm_button');

cancel_button.addEventListener('click', () => {
    window.close();
});

confirm_button.addEventListener('click', () => {
    confirm_button.disabled = true;
    confirm_button.style.opacity = "0.5";
    chrome.runtime.sendMessage({ action: "clean" }, (response) => {
        if (response.status == "ok") {
            console.log("clean history successfully");
        }
    });
});