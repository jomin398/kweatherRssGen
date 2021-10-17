let xhr = new XMLHttpRequest();
let domparser = new DOMParser();
let resEle = null;
let refurl = 'https://www.weather.go.kr/w/pop/rss-guide.do';
let sel = null;
let doc = null;
window.onload = () => {
    xhr.open('get', refurl);
    xhr.withCredentials = true;
    xhr.onload = () => {
        doc = domparser.parseFromString(xhr.response, 'text/html')
        document.body.appendChild(doc.querySelector('#dfs-form > div > div:nth-child(1)'));
        document.body.querySelector('.cmp-form-select.cmp-form-input-quad.label-on').className = 'input-do';
        btn = document.body.querySelector('.input-do input[type=submit]')
        btn.remove();
        btn = document.createElement('button');
        btn.className = 'gen';
        btn.innerText = '선택';
        btn.onclick = () => {
            sel = document.querySelector('.select select');
            refurl = refurl + "?sido=" + sel.options[sel.selectedIndex].value;
            resEle = document.createElement('p');
            resEle.innerText = refurl;
            resEle.className = 'resultRaw';
            document.body.appendChild(resEle);
            xhr.open('get', refurl);
            xhr.onload = () => { sel2(2) };
            xhr.send();
        }
        document.body.querySelector('.input-do').appendChild(btn);
    }
    xhr.send()
    function sel2(restime) {
        console.log(restime);
        if (restime == 2 || restime == 3) {
            doc = domparser.parseFromString(xhr.response, 'text/html')
            data = doc.querySelector('#dfs-form > div > div:nth-child(' + restime + ')');
            document.body.querySelector('.input-do label').innerText = data.querySelector('label').innerText;
            document.querySelector('.input-do .select').innerHTML = data.querySelector('.select').innerHTML;
            if (restime == 3) {
                btn.className = 'rss';
                btn.innerText = 'RSS 생성';
            }
            btn.onclick = () => {
                sel = document.querySelector('.select select');
                refurl = refurl + (restime == 2 ? '&gugun=' : '&dong=') + sel.options[sel.selectedIndex].value;
                document.querySelector('.resultRaw').innerText = refurl;
                xhr.open('get', refurl);
                xhr.onload = () => {
                    if (restime == 2) {
                        sel2(3)
                    } else {
                        sel2(4)
                    }
                };
                xhr.send();
            }
        } else if (restime == 4) {
            doc = domparser.parseFromString(xhr.response, 'text/html')
            data = doc.querySelector('#dfs-form > div > div.cmp-form-input.cmp-form-input-quad.text-center > a');
            document.querySelector('.resultRaw').innerText = data.href;

            xhr.open('get', data.href);
            xhr.onload = () => {
                resDisplay = document.createElement('div');
                resDisplay.className = 'resDisplay';
                doc = domparser.parseFromString(xhr.responseText, 'text/xml');
                resDisplay.innerText = doc.documentElement.innerHTML;
                document.body.appendChild(resDisplay);
            };
            xhr.send()
        }
    };
}