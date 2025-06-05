// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
function loadScript(file) {
   return new Promise((resolve, reject) => {
       // 檢查是否已經載入相同的 script
       if (document.querySelector(`script[src="${file}"]`)) {
           resolve(`Script already loaded: ${file}`);
           return;
       }
       const script = document.createElement('script');
       script.type = 'text/javascript';
       script.src = file;
       script.async = true;
       script.onload = () => {
           //console.log(`Script loaded: ${file}`);
           resolve(file);
       };
       script.onerror = () => {
           //console.error(`Failed to load script: ${file}`);
           reject(new Error(`Failed to load script: ${file}`));
       };
       document.head.appendChild(script);
   });
}