let btns = document.querySelectorAll('button')
let screen = document.querySelector('h2')
btns.forEach((btn) => {
    btn.addEventListener('click', ()=>{
        let text = btn.innerText;
        if(text == 'C'){
            screen.innerText = ''
        }else if(text == '='){
            let str = screen.innerText;
            let solve = eval(str);
            screen.innerText = solve;
        }else if(text == 'Del'){
            let str = screen.innerText;
            let arrStr = str.split('');
            arrStr.pop();
            let newStr = arrStr.join('');
            screen.innerText = newStr;
        }else{
            screen.innerText = screen.innerText + text;
        }
    });
});
