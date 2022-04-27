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
const password = '1';

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
            if (document.getElementById('supertable')) document.getElementById('container').removeChild(document.getElementById('supertable'));
            if (document.getElementById('supertable2')) document.getElementById('container').removeChild(document.getElementById('supertable2'));
            if (document.getElementById('sorting_buttons')) document.getElementById('container').removeChild(document.getElementById('sorting_buttons'));
            for (let j=0; j<champs.length; j+=1) {
                champs[j].classList.remove('choosen');
            }
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
            if (document.getElementById('supertable')) document.getElementById('container').removeChild(document.getElementById('supertable'));
            if (document.getElementById('supertable2')) document.getElementById('container').removeChild(document.getElementById('supertable2'));
            if (document.getElementById('sorting_buttons')) document.getElementById('container').removeChild(document.getElementById('sorting_buttons'));
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
    if (param === 0) getCalendarTable(champ)
    else if (param === 1) showLast5(champ)
    // else if( param === 2) showAllTime(champ)
}

let result = Array(22).fill().map(()=>Array(14).fill());
const gid_calendar = [0,1968139431,1054150177,1855716394,2119734893,947408769,1764379034,567087809,192465817,430268839];
const gid_xg = [1723156808]
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
        table.id='supertable2';
        let result = Array(gid_clubs[champ]+2).fill().map(()=>Array(players_number).fill());
        for (let i=0; i<gid_clubs[champ]+2; i+=1) {
            const tr = table.insertRow();
            tr.className = 'superrow2';
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
                document.querySelectorAll('.superrow2')[i].querySelectorAll('.supercell')[j-1].classList.add(`${color}`);                      
            }
        }

        for (let i=0; i<players_number; i+=1) {
            document.querySelectorAll('.superrow2')[1].querySelectorAll('.supercell')[i].addEventListener('click', ()=>{sortCalendar(i)});
        }
    })
}

function sortCalendar(column) {
    const rows = document.querySelectorAll('.superrow2').length;
    const columns = 14;
    let table = Array(rows-2).fill().map(()=>Array(columns).fill(''));
    let newarr = [];
    for (let i=0; i<rows-2; i+=1) {
        for (let j=0; j<columns; j+=1) {
            table[i][j] = document.querySelectorAll('.superrow2')[i+2].querySelectorAll('.supercell')[j].innerText;
        }
    }
    for (let j=0; j<columns; j+=1) {
        if (j!==column) document.querySelectorAll('.superrow2')[1].querySelectorAll('.supercell')[j].className = 'supercell';
    }
    if (document.querySelectorAll('.superrow2')[1].querySelectorAll('.supercell')[column].classList.contains('increase')) {
        document.querySelectorAll('.superrow2')[1].querySelectorAll('.supercell')[column].classList.remove('increase');
        document.querySelectorAll('.superrow2')[1].querySelectorAll('.supercell')[column].classList.add('decrease');
        if(isNaN(table[1][column])||table[1][column]==='') newarr = table.sort((a,b)=>b[column].localeCompare(a[column]));
        else newarr = table.sort((a,b)=>b[column] - a[column]);
    } else {
        document.querySelectorAll('.superrow2')[1].querySelectorAll('.supercell')[column].classList.add('increase');
        document.querySelectorAll('.superrow2')[1].querySelectorAll('.supercell')[column].classList.remove('decrease');
        if(isNaN(table[1][column])||table[1][column]==='') newarr = table.sort((a,b)=>a[column].localeCompare(b[column]));
        else newarr = table.sort((a,b)=>a[column] - b[column]);
    }
    for (let i=0; i<rows-2; i+=1) {
        for (let j=0; j<columns; j+=1) {
            document.querySelectorAll('.superrow2')[i+2].querySelectorAll('.supercell')[j].innerText = newarr[i][j];
        }
    }
    for (let i=2;i<rows;i+=1) {
        for (let j=7; j<columns;j+=2) {
            const color = newarr[i-2][j]===''?'none' : Number(newarr[i-2][j])>6.4? 'brown': Number(newarr[i-2][j])>3.8? 'red':Number(newarr[i-2][j])>2.7? 'orange':Number(newarr[i-2][j])>2.1? 'yellow': Number(newarr[i-2][j])>1.7? 'lightgreen': Number(newarr[i-2][j])>1.45? 'green':newarr[i-2][j]>1.27? 'lightblue': Number(newarr[i-2][j])>1.12? 'blue': Number(newarr[i-2][j])>1? 'violet': 'none';
            document.querySelectorAll('.superrow2')[i].querySelectorAll('.supercell')[j-1].className = 'supercell'; 
            document.querySelectorAll('.superrow2')[i].querySelectorAll('.supercell')[j-1].classList.add(`${color}`);                      
        }
    }
    //
}
let temp_copy_table_last5 = [];
function showLast5(champ) {
    getCalendarTable(champ);
    const url = `https://docs.google.com/spreadsheets/d/1UdQlPmTOEp59FRsR-tidwryW0YjxiAfiM0sn-N3p5Ek/gviz/tq?gid=${gid_xg[champ]}`;
    fetch(url)
    .then(res => res.text())
    .then(data => {
        // console.log(data)
        const data2 = JSON.parse(data.substr(47).slice(0,-2));
        const columns = 26;
        const rows = data2.table.rows.length;
        const table = document.createElement('table');
        const headers = ['Игрок', 'Клуб', 'Позиция (Wyscout)', 'Позиция (sports)', 'Цена', 'МО ФО', 'ООП', 'инд. опасности', 'app', 'min', 'min/app', 'goals', 'xg', 'xg/90', 'assists', 'xa', 'xa/90','yellow', 'red', 'shots', 'SOT %', 'key pass', 'tib/90', 'pen', 'xg+xa /90', 'кш/итб'];
        table.className = 'supertable';
        table.id='supertable';
        let result = Array(rows+1).fill().map(()=>Array(columns).fill());
        const calendar_table = document.getElementById('supertable2').querySelectorAll('.superrow2');
        const club = [];
        const cleansheet = [];
        const itb = [];
        for (let i=2; i< calendar_table.length;i+=1) {
            club.push(calendar_table[i].querySelectorAll('.supercell')[3].innerText)
            cleansheet.push(calendar_table[i].querySelectorAll('.supercell')[4].innerText)
            itb.push(calendar_table[i].querySelectorAll('.supercell')[5].innerText)
        }
        for (let i=0; i<rows+1; i+=1) {
            const tr = table.insertRow();
            tr.className = 'superrow';
            for (let j=0; j<columns; j+=1) {
                const td = tr.insertCell();
                td.className = 'supercell_xg';
                td.style.width = j<2? '10vw': j===2?'7vw': j<4? '3vw' : j<7? '2vw': j===7? '4vw': j>23? '2vw': '3vw';
                if (i === 0) {
                    td.appendChild(document.createTextNode(`${headers[j]}`));
                    result[i][j] = headers[j];
                } else {
                    if (j<8) {
                        if (data2.table.rows[i-1].c[j+1] && Object.keys(data2.table.rows[i-1].c[j+1]).includes('v')) {
                            td.appendChild(document.createTextNode(`${data2.table.rows[i-1].c[j+1].v}`));
                            result[i][j] = data2.table.rows[i-1].c[j+1].v;
                        } else {
                            result[i][j] = '';
                        }
                    } else if(j===24) {
                        td.appendChild(document.createTextNode(`${Math.round((Number(result[i][13])+Number(result[i][16]))*100)/100}`));
                        result[i][j] = Math.round((Number(result[i][13])+Number(result[i][16]))*100)/100;
                    } else if(j===25) {
                        if(result[i][3] === 'вр' || result[i][3] === 'защ') {
                            td.appendChild(document.createTextNode(`${cleansheet[club.indexOf(result[i][1])]||0}`));
                            result[i][j] = cleansheet[club.indexOf(result[i][1])]||0;
                        } else {
                            td.appendChild(document.createTextNode(`${itb[club.indexOf(result[i][1])]||0}`));
                            result[i][j] = itb[club.indexOf(result[i][1])]||0;
                        }
                    } else {
                        if (data2.table.rows[i-1].c[j+2] && Object.keys(data2.table.rows[i-1].c[j+2]).includes('v')) {
                            td.appendChild(document.createTextNode(`${data2.table.rows[i-1].c[j+2].v}`));
                            result[i][j] = data2.table.rows[i-1].c[j+2].v;
                        } else {
                            result[i][j] = '';
                        }
                    }
                }
            }
        }
        temp_copy_table_last5 = Array.from(result);
        const sorting_buttons = document.createElement('div');
        sorting_buttons.className = 'sorting_buttons';
        sorting_buttons.id = 'sorting_buttons';
        const remove_empty = document.createElement('div');
        remove_empty.className = 'button';
        remove_empty.id = 'remove_empty';
        remove_empty.innerText = 'Удалить пустые';
        sorting_buttons.appendChild(remove_empty);
        const select_club = document.createElement('select');
        select_club.className = 'select_club';
        select_club.id = 'select_club';
        const select_club_option = document.createElement('option');
        select_club_option.innerText = `Выберите клуб`;
        select_club_option.value = 0;
        select_club_option.selected = true;
        select_club.appendChild(select_club_option);
        const clubs = [];
        for (let i=0; i<result.length; i+=1) {
            if (result[i][1]!=='' && result[i][1]!=='Клуб') clubs.push(result[i][1]);
        }
        const uniq_clubs = Array.from(new Set(clubs)).sort();
        for (let i=0; i<gid_clubs[champ]; i+=1) {
            const select_club_option = document.createElement('option');
            select_club_option.value = `${uniq_clubs[i]}`;
            select_club_option.innerText = `${uniq_clubs[i]}`;
            select_club.appendChild(select_club_option);
        }
        sorting_buttons.appendChild(select_club);
        const select_pos = document.createElement('select');
        select_pos.className = 'select_pos';
        select_pos.id = 'select_pos';
        const select_pos_option = document.createElement('option');
        select_pos_option.innerText = `Выберите позицию`;
        select_pos_option.value = 0;
        select_pos_option.selected = true;
        select_pos.appendChild(select_pos_option);
        const pos = ['вр','защ','пз','нап'];
        for (let i=0; i<4; i+=1) {
            const select_pos_option = document.createElement('option');
            select_pos_option.value = `${pos[i]}`;
            select_pos_option.innerText = `${pos[i]}`;
            select_pos.appendChild(select_pos_option);
        }
        sorting_buttons.appendChild(select_pos);
        const reset_filter = document.createElement('div');
        reset_filter.className = 'button';
        reset_filter.id = 'reset_filter';
        reset_filter.innerText = 'Сбросить фильтры';
        sorting_buttons.appendChild(reset_filter);
        document.getElementById('container').insertBefore(sorting_buttons,document.getElementById('supertable2'));
        document.getElementById('container').insertBefore(table,document.getElementById('supertable2'));

        for (let i=0; i<columns; i+=1) {
            document.querySelectorAll('.superrow')[0].querySelectorAll('.supercell_xg')[i].addEventListener('click', ()=>{sortLast5(i)});
        }
        document.getElementById('remove_empty').addEventListener('click',removeEmpty);
        document.getElementById('select_club').addEventListener('change', updateTable);
        document.getElementById('select_pos').addEventListener('change', updateTable);
        document.getElementById('reset_filter').addEventListener('click',resetFilter);
    })
}
function sortLast5(column) {
    const rows = document.querySelectorAll('.superrow').length;
    const columns = 26;
    let table = Array(rows-1).fill().map(()=>Array(columns).fill(''));
    let newarr = [];
    for (let i=0; i<rows-1; i+=1) {
        for (let j=0; j<columns; j+=1) {
            table[i][j] = document.querySelectorAll('.superrow')[i+1].querySelectorAll('.supercell_xg')[j].innerText;
        }
    }
    for (let j=0; j<columns; j+=1) {
        if (j!==column) document.querySelectorAll('.superrow')[0].querySelectorAll('.supercell_xg')[j].className = 'supercell_xg';
    }
    if (document.querySelectorAll('.superrow')[0].querySelectorAll('.supercell_xg')[column].classList.contains('decrease')) {
        document.querySelectorAll('.superrow')[0].querySelectorAll('.supercell_xg')[column].classList.add('increase');
        document.querySelectorAll('.superrow')[0].querySelectorAll('.supercell_xg')[column].classList.remove('decrease');
        if(isNaN(table[0][column])||table[0][column]==='') newarr = table.sort((a,b)=>b[column].localeCompare(a[column]));
        else newarr = table.sort((a,b)=>b[column] - a[column]);   
    } else {
        document.querySelectorAll('.superrow')[0].querySelectorAll('.supercell_xg')[column].classList.remove('increase');
        document.querySelectorAll('.superrow')[0].querySelectorAll('.supercell_xg')[column].classList.add('decrease');
        if(isNaN(table[0][column])||table[0][column]==='') newarr = table.sort((a,b)=>a[column].localeCompare(b[column]));
        else newarr = table.sort((a,b)=>a[column] - b[column]);    
    }
    for (let i=0; i<newarr.length; i+=1) {
        for (let j=0; j<columns; j+=1) {
            console.log(i+1,j)
            document.querySelectorAll('.superrow')[i+1].querySelectorAll('.supercell_xg')[j].innerText = newarr[i][j];
        }
    }
}

function updateTable() {
    document.querySelectorAll('.supercell').forEach((el)=>el.classList.remove('bold'));
    const rows = temp_copy_table_last5.length;
    const current_rows = document.querySelectorAll('.superrow').length;
    const columns = 26;
    for (let j=0; j<columns; j+=1) {
        document.querySelectorAll('.superrow')[0].querySelectorAll('.supercell_xg')[j].className = 'supercell_xg';
    }
    const table = Array.from(temp_copy_table_last5);
    const club = document.getElementById('select_club').value
    const pos = document.getElementById('select_pos').value
    let newtable = [];
    const calendar_table = document.getElementById('supertable2').querySelectorAll('.superrow2');
    const selected_club = [];
    for (let i=2; i< calendar_table.length;i+=1) {
        selected_club.push(calendar_table[i].querySelectorAll('.supercell')[3].innerText)
    }
    if (club !== '0' && pos !== '0') {
        newtable = table.filter((el)=>el[1]===club).filter((el)=>el[3]===pos);
        document.querySelectorAll('.superrow2')[selected_club.indexOf(club)+2].querySelectorAll('.supercell').forEach((el)=>el.classList.add('bold'));
    } else if (club === '0' &&  pos === '0') {
        newtable = table.filter((el)=>el[0]!=='Игрок');
    } else if (club !== '0') {
        newtable = table.filter((el)=>el[1]===club);
        document.querySelectorAll('.superrow2')[selected_club.indexOf(club)+2].querySelectorAll('.supercell').forEach((el)=>el.classList.add('bold'));
    } else if (pos !== '0') {
        newtable = table.filter((el)=>el[3]===pos);
    }
    console.log(current_rows-1, newtable.length);
    if (current_rows-1-newtable.length >= 0) {
        for (let i=0; i<current_rows-1-newtable.length; i+=1) {
            document.getElementById('supertable').deleteRow(1);
        }
    } else {
        for (let i=0; i<newtable.length - current_rows+1; i+=1) {
            const tr = document.getElementById('supertable').insertRow(1);
            tr.className = 'superrow';
            for (let j=0; j<columns; j+=1) {
                const td = tr.insertCell();
                td.className = 'supercell_xg';
                td.style.width = j<2? '10vw': j===2?'7vw': j<4? '3vw' : j<7? '2vw': j===7? '4vw': j>23? '2vw': '3vw';
            }
        }
    }
    for (let i=0; i<newtable.length; i+=1) {
        for (let j=0; j<columns; j+=1) {
            document.querySelectorAll('.superrow')[i+1].querySelectorAll('.supercell_xg')[j].innerText = newtable[i][j];
        }
    }
}

function resetFilter() {
    let currentparam = 0;
    let currentchamp = 0;
    const champs = document.getElementById('champs').children;
    const settings = document.getElementById('settings').children;
    for (let k=0; k<settings.length; k+=1) {
        if (settings[k].classList.value==='choosen') currentparam = k;
    }
    for (let k=0; k<champs.length; k+=1) {
        if (champs[k].classList.value==='choosen') currentchamp = k;
    }
    document.getElementById('container').removeChild(document.querySelector('.sorting_buttons'));
    document.getElementById('container').removeChild(document.getElementById('supertable'));
    document.getElementById('container').removeChild(document.getElementById('supertable2'));
    showStatistics(currentchamp,currentparam); 
}

function removeEmpty() {
    const rows = document.querySelectorAll('.superrow').length;
    const columns = 26;
    let table = Array(rows-1).fill().map(()=>Array(columns).fill(''));
    let newarr = [];
    for (let i=0; i<rows-1; i+=1) {
        for (let j=0; j<columns; j+=1) {
            table[i][j] = document.querySelectorAll('.superrow')[i+1].querySelectorAll('.supercell_xg')[j].innerText;
        }
    }
    const newtable = table.filter(el=>el[0]!=='');
    for (let i=0; i<table.length-newtable.length; i+=1) {
        document.getElementById('supertable').deleteRow(1);
    }
    for (let i=0; i<newtable.length; i+=1) {
        for (let j=0; j<columns; j+=1) {
            document.querySelectorAll('.superrow')[i+1].querySelectorAll('.supercell_xg')[j].innerText = newtable[i][j];
        }
    }
    document.getElementById('remove_empty').classList.add('choosen');
    document.getElementById('remove_empty').setAttribute('style', 'pointer-events:none');
}