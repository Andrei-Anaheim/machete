// window.onload = function() {
//     let getJson = function(url, callback) {
//         let xhr = new XMLHttpRequest();
//         xhr.open('GET', url, true);
//         xhr.responseType = 'json';
//         xhr.onload = function () {
//             let status = xhr.status;
//             if (status === 200) {
//                 callback(null, xhr.response);
//             } else {
//                 callback(status, xhr.response);
//             }
//         };
//         xhr.send();
//     }
//     // getJson('https://www.googleapis.com/auth/spreadsheets/list/1UdQlPmTOEp59FRsR-tidwryW0YjxiAfiM0sn-N3p5Ek/od6/public/values?alt=json', function(err, data){
//     //     console.log(data);
//     // })
//     getJson('https://script.googleusercontent.com/macros/echo?user_content_key=1b5hBnzfiLsDSLEerxVDyp-GJJ7aSmqfybE7ZmaUNaiuvsu7H0p55JhvlSA8_LN2KXiYrf4xz9I9IOAVqhEtS4p8px0mR1aum5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnFuDAfwug1yL3B2PnuJyla1LWTEPPqRRhNy55riZXswjkoZkEqMRmDJ4qhBgO_Q-wihp9zFSCUebKkHngrxYp8dyFD29XyCDsQ&lib=M9lU7NEH-g3Ix1WlYlLaKbLFN_NBHU71F', function(err, data){
//     console.log(data);})
// }






//0. Авторизация
document.getElementById('auth_ok').addEventListener('click',sezamOpen);
const password = 'стасбенч';

function sezamOpen() {
    document.getElementById('auth_error').classList.add('hide');
    const userPassword = document.getElementById('password').value;
    if (userPassword !== password) {
        document.getElementById('auth_error').classList.remove('hide')
    } else {
        document.getElementById('authorization').classList.add('hide');
        addChampsMenu();
        addSettingsMenu();
        addEventListeners();
        showStatistics(0,0);
    }

}

//1. Выделение выбранного чемпионата и формата данных
function addChampsMenu() {
    document.getElementById('container').innerHTML += `
    <div class="champs_list">
        <ul class="champs" id="champs">
            <li class="choosen">Англия</li>
            <li>Испания</li>
            <li>Германия</li>
            <li>Италия</li>
            <li>Франция</li>
            <li>Россия</li>
            <li>Чемпионшип</li>
            <li>Турция</li>
            <li>Нидерланды</li>
            <li>Португалия</li>
        </ul>
    </div>`
}
function addSettingsMenu() {
    document.getElementById('container').innerHTML += `
    <div class="settings_list">
        <ul class="settings" id="settings">
            <li class="choosen">Календарь</li>
            <li>Стата last5</li>
            <li>Стата alltime</li>
        </ul>
    </div>`
}
function addEventListeners() {
    const champs = document.getElementById('champs').children;
    const settings = document.getElementById('settings').children;
    for (let i=0; i<champs.length; i+=1) {
        champs[i].addEventListener('click', (e)=>{
            let param = 0;
            e.stopPropagation();
            e.preventDefault();
            document.getElementById('container').removeChild(document.getElementById('supertable'));
            for (let j=0; j<champs.length; j+=1) {
                champs[j].classList.remove('choosen');
            }
            console.log(champs[i]);
            champs[i].classList.add('choosen');
            for (let k=0; k<settings.length; k+=1) {
                if (settings[k].classList.value==='choosen') param = k;
            }
            // console.log(i, param);
            showStatistics(i,param)
        });
    }
    for (let i=0; i<settings.length; i+=1) {
        settings[i].addEventListener('click', (e)=>{
            let champ = 0;
            e.stopPropagation();
            e.preventDefault();
            document.getElementById('container').removeChild(document.getElementById('supertable'));
            for (let j=0; j<settings.length; j+=1) {
                settings[j].classList.remove('choosen');
            }
            for (let k=0; k<champs.length; k+=1) {
                if (champs[k].classList.value==='choosen') champ = k;
            }
            settings[i].classList.add('choosen');
            // console.log(champ, i);
            showStatistics(champ,i);
        });
    }
}

function showStatistics(champ, param) {
    if (param === 0) showCalendar(champ)
    // else if (param === 1) showLast5(champ)
    // else if( param === 2) showAllTime(champ)
}

function showCalendar(champ) {
    getCalendarTable(champ);
}

let result = Array(22).fill().map(()=>Array(14).fill());
const gid_calendar = [0,1968139431,1054150177,1855716394,2119734893,947408769,1764379034,567087809,192465817,430268839]
const gid_clubs = [20,20,18,20,20,16,24,20,18,18]
function getCalendarTable(champ) {
    const url = `https://docs.google.com/spreadsheets/d/1UdQlPmTOEp59FRsR-tidwryW0YjxiAfiM0sn-N3p5Ek/gviz/tq?gid=${gid_calendar[champ]}`;
    let start_column = 0;
    // let end_column = 0;
    fetch(url)
    .then(res => res.text())
    .then(data => {
        // console.log(data)
        const data2 = JSON.parse(data.substr(47).slice(0,-2));
        const tour = data2.table.rows[0].c[4].v
        for (let i=5; i<data2.table.rows[0].c.length; i+=1) {
            if (data2.table.rows[0].c[i] && Object.keys(data2.table.rows[0].c[i]).includes('v') && Number(data2.table.rows[0].c[i].v) === tour) start_column = i;
            if (data2.table.rows[0].c[i] && Object.keys(data2.table.rows[0].c[i]).includes('v') && Number(data2.table.rows[0].c[i].v) === tour+1) end_column = i;
        }
        const players_number = 14;
        const table = document.createElement('table');
        const headers = ['ср.кэф', 'xG', 'xGA', 'Команда', 'КШ', 'ИТБ', 'Соперник', 'кэф', 'Соперник', 'кэф', 'Соперник', 'кэф', 'Соперник', 'кэф'];
        table.className = 'supertable';
        table.id='supertable';
        let result = Array(gid_clubs[champ]+2).fill().map(()=>Array(players_number).fill());
        for (let i=0; i<gid_clubs[champ]+2; i+=1) {
            const tr = table.insertRow();
            tr.className = 'superrow';
            for (let j=0; j<players_number; j+=1) {
                const td = tr.insertCell();
                td.className = 'supercell';
                td.style.width = j<3? '3vw': j===3? '13vw' : j<6? '3vw': j%2===0?'13vw':'3vw';
                if (i === 1) {
                    td.appendChild(document.createTextNode(`${headers[j]}`));
                    result[i][j] = headers[j];
                } else {
                    if (j<6) {
                        if (data2.table.rows[i].c[j] && Object.keys(data2.table.rows[i].c[j]).includes('v')) {
                            td.appendChild(document.createTextNode(`${data2.table.rows[i].c[j].v}`));
                            result[i][j] = data2.table.rows[i].c[j].v;
                        } else {
                            result[i][j] = '';
                        }
                    } else {
                        if (j%2===0) {
                            if (data2.table.rows[i].c[start_column+(j-6)/2*3] && Object.keys(data2.table.rows[i].c[start_column+(j-6)/2*3]).includes('v')) {
                                td.appendChild(document.createTextNode(`${data2.table.rows[i].c[start_column+(j-6)/2*3].v}`));
                                result[i][j] = data2.table.rows[i].c[start_column+(j-6)/2*3].v;
                            } else {
                                result[i][j] = '';
                            }
                        } else {
                            if (data2.table.rows[i].c[start_column+(j-7)/2*3+1] && Object.keys(data2.table.rows[i].c[start_column+(j-7)/2*3+1]).includes('v')) {
                                td.appendChild(document.createTextNode(`${data2.table.rows[i].c[start_column+(j-7)/2*3+1].v}`));
                                result[i][j] = data2.table.rows[i].c[start_column+(j-7)/2*3+1].v;
                            } else {
                                result[i][j] = '';
                            }
                        }
                    }
                }
            }
        }
        document.getElementById('container').appendChild(table);
        
        for (let i=2;i<gid_clubs[champ]+2;i+=1) {
            for (let j=7; j<players_number;j+=2) {
                const color = Number(result[i][j])>6.4? 'brown': Number(result[i][j])>3.8? 'red':Number(result[i][j])>2.7? 'orange':Number(result[i][j])>2.1? 'yellow': Number(result[i][j])>1.7? 'lightgreen': Number(result[i][j])>1.45? 'green':result[i][j]>1.27? 'lightblue': Number(result[i][j])>1.12? 'blue': Number(result[i][j])>1? 'violet': 'none';
                document.querySelectorAll('.superrow')[i].querySelectorAll('.supercell')[j-1].classList.add(`${color}`);                      
            }
        }

        for (let i=0; i<players_number; i+=1) {
            document.querySelectorAll('.superrow')[1].querySelectorAll('.supercell')[i].addEventListener('click', ()=>{sortCalendar(i)});
        }
    })
}

function sortCalendar(column) {
    const rows = document.querySelectorAll('.superrow').length;
    const columns = 14;
    let table = Array(rows-2).fill().map(()=>Array(columns).fill(''));
    let newarr = [];
    for (let i=0; i<rows-2; i+=1) {
        for (let j=0; j<columns; j+=1) {
            table[i][j] = document.querySelectorAll('.superrow')[i+2].querySelectorAll('.supercell')[j].innerText;
        }
    }
    for (let j=0; j<columns; j+=1) {
        if (j!==column) document.querySelectorAll('.superrow')[1].querySelectorAll('.supercell')[j].className = 'supercell';
    }
    if (document.querySelectorAll('.superrow')[1].querySelectorAll('.supercell')[column].classList.contains('increase')) {
        document.querySelectorAll('.superrow')[1].querySelectorAll('.supercell')[column].classList.remove('increase');
        document.querySelectorAll('.superrow')[1].querySelectorAll('.supercell')[column].classList.add('decrease');
        if(isNaN(table[1][column])||table[1][column]==='') newarr = table.sort((a,b)=>b[column].localeCompare(a[column]));
        else newarr = table.sort((a,b)=>b[column] - a[column]);
    } else {
        document.querySelectorAll('.superrow')[1].querySelectorAll('.supercell')[column].classList.add('increase');
        document.querySelectorAll('.superrow')[1].querySelectorAll('.supercell')[column].classList.remove('decrease');
        if(isNaN(table[1][column])||table[1][column]==='') newarr = table.sort((a,b)=>a[column].localeCompare(b[column]));
        else newarr = table.sort((a,b)=>a[column] - b[column]);
    }
    for (let i=0; i<rows-2; i+=1) {
        for (let j=0; j<columns; j+=1) {
            document.querySelectorAll('.superrow')[i+2].querySelectorAll('.supercell')[j].innerText = newarr[i][j];
        }
    }
    for (let i=2;i<rows;i+=1) {
        for (let j=7; j<columns;j+=2) {
            const color = newarr[i-2][j]===''?'none' : Number(newarr[i-2][j])>6.4? 'brown': Number(newarr[i-2][j])>3.8? 'red':Number(newarr[i-2][j])>2.7? 'orange':Number(newarr[i-2][j])>2.1? 'yellow': Number(newarr[i-2][j])>1.7? 'lightgreen': Number(newarr[i-2][j])>1.45? 'green':newarr[i-2][j]>1.27? 'lightblue': Number(newarr[i-2][j])>1.12? 'blue': Number(newarr[i-2][j])>1? 'violet': 'none';
            console.log(i,j-7,newarr[i-2][j],color);
            document.querySelectorAll('.superrow')[i].querySelectorAll('.supercell')[j-1].className = 'supercell'; 
            document.querySelectorAll('.superrow')[i].querySelectorAll('.supercell')[j-1].classList.add(`${color}`);                      
        }
    }
    //
}
