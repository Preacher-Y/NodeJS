const socket = io();

socket.on('message',(text)=>{
    const mes = document.createElement('li');
    mes.innerHTML=text;
    document.querySelector('ul').appendChild(mes);
})

document.querySelector('button').onclick = ()=>{
    const text = document.querySelector('input').value;
    socket.emit('message',text);
    document.querySelector('input').value = '';
}