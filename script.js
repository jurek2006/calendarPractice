
class CalendarView{
// klasa generująca widok kalendarza w zadanym elemencie html
    constructor(parentDomElement = document.querySelector('body')){
        this.parentDomElement = parentDomElement;
        this.setCalendarDate();
    }

    setCalendarDate(year = new Date().getFullYear(), month = new Date().getMonth()+1){
        this.month = month;
        this.year = year;
        const monthPicker = document.querySelector('select[name="month"]');
        monthPicker.value = this.month;
        const yearPicker = document.querySelector('select[name="year"]');
        yearPicker.value = this.year;
        this.draw();
    }

    draw(){
    // metoda rysująca kalendarz w elemencie this.parentDomElement
    
        const startDay = new Date(this.year, this.month -1, 1);
        const endDay = new Date(this.year, this.month, 0);
        const day = new Day(document.querySelector('.dayView'));

        // obliczenie liczby dni w miesiącu
        let daysCount = endDay.getDate() - startDay.getDate() +1;


        // obliczenie dni z poprzedniego miesiąca, które trzeba dodać przed aktualnymi (i z następnego po), żeby się zgadzało wyświetlanie
        const numDaysFromPrevMonth = (startDay.getDay() + 6) % 7;
        const numDaysFromNextMonth = 6 - (endDay.getDay() + 6) % 7;

        // wyczyszczenie widoku kalendarza (utworzenie nagłówków dni)
            this.parentDomElement.innerHTML = `
                <div class="dayHeader"><h1>Poniedziałek</h1></div>
                <div class="dayHeader"><h1>Wtorek</h1></div>
                <div class="dayHeader"><h1>Środa</h1></div>
                <div class="dayHeader"><h1>Czwartek</h1></div>
                <div class="dayHeader"><h1>Piątek</h1></div>
                <div class="dayHeader"><h1>Sobota</h1></div>
                <div class="dayHeader"><h1>Niedziela</h1></div>
            `;

        // dodanie pól kalendarza 
        for (let i = 0; i < numDaysFromPrevMonth; i++){
            const dayElem = document.createElement('div');
            dayElem.classList.add('day', 'day--inactive');
            this.parentDomElement.appendChild(dayElem);
        }

        for(let i = 1; i <= daysCount; i++){
            const currDay = new Date(this.year, this.month -1, i);
            const dayElem = document.createElement('div');
            dayElem.classList.add('day', 'day--active');
            dayElem.innerHTML = `<h2 class="day__lbl">${currDay.getDate()}</h2>`;
            dayElem.setAttribute('data-date', '');
            dayElem.addEventListener('click',() => day.show(currDay));
            this.parentDomElement.appendChild(dayElem);
        }

        for (let i = 0; i < numDaysFromNextMonth; i++){
            const dayElem = document.createElement('div');
            dayElem.classList.add('day', 'day--inactive');
            this.parentDomElement.appendChild(dayElem);
        }

    }
}

class Day{
    constructor(parentDomElement = document.querySelector('body')){
        this.parentDomElement = parentDomElement;
        this.tasks = new Tasks();

        // obsługa przycisku zamknięcia panelu dnia
        this.parentDomElement.querySelector('.dayView__close').addEventListener('click', () =>{
            this.hide();
        });

        
        
    }

    show(date){
        this.date = date;
        this.parentDomElement.classList.remove('dayView--hidden');
        const dayHeader = this.parentDomElement.querySelector('h1');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dayHeader.innerText = new Intl.DateTimeFormat('pl-PL', options).format(date);

        const addTaskForm = this.parentDomElement.querySelector('.addTaskForm'); 
        addTaskForm.setAttribute('data-date', `${this.date.getFullYear()}-${this.date.getMonth()+1}-${this.date.getDate()}` );

        console.table(this.tasks.getTasksOfDay(date));
    }

    hide(){
        this.parentDomElement.classList.add('dayView--hidden');
    }

    getDate(){
        return this.date();
    }
}

class Tasks{
    constructor(){
        this.arr = [];
    }

    addTask(name, date, time, priority = 0, isDone = false){

        if(date){
            let hour = 0, min = 0;
            if(time){
                [hour, min] = time.split(':');
            }
            let [year, month, day] = date.split('-');
            date = new Date(year, month-1, day, hour, min);
        }

        this.arr.push({
            name,
            date,
            time,
            priority,
            isDone
        });
    }

    showInConsole(){
        console.table(this.arr);
    }

    getTasksOfDay(date){
        let dateTomorrow;
        
        if(date){
            let year, month, day;
            if(date instanceof Date){
                console.log(date, 'date');

            }else if(typeof date === 'string'){
                console.log(date, 'string');
                [year, month, day] = date.split('-');
                date = new Date(year, month-1, day);
                dateTomorrow = new Date(year, month-1, day+1);
            }

        } else return;
        console.table(this.arr);
        const newArr = this.arr.filter((currTask) => {
            return currTask.date.getTime() >= date.getTime() && currTask.date.getTime() < dateTomorrow.getTime();
        });
        return newArr;
    }
}

class App{
    constructor(){
        const calendarView = new CalendarView(document.querySelector('.calendarView'));
        // calendarView.setCalendarDate(2018,5);
        const day = new Day(document.querySelector('.dayView'));
        const tasks = new Tasks();

        // zdarzenia wyboru roku i miesiąca
        const monthPicker = document.querySelector('select[name="month"]');
        const yearPicker = document.querySelector('select[name="year"]');
        monthPicker.addEventListener('change', () => calendarView.setCalendarDate(yearPicker[yearPicker.selectedIndex].value, monthPicker[monthPicker.selectedIndex].value));
        yearPicker.addEventListener('change', () => calendarView.setCalendarDate(yearPicker[yearPicker.selectedIndex].value, monthPicker[monthPicker.selectedIndex].value));

        // zdarzenie obsługi przycisku "Dodaj zadanie"
        const addTaskBtn = document.querySelector('.dayView__addTaskBtn');
        const addTaskForm = document.querySelector('.addTaskForm');
        addTaskBtn.addEventListener('click', (evt) => {
            addTaskBtn.classList.add('hidden');
            addTaskForm.classList.remove('hidden');
        });

        // Zdarzenie kliknięcia w "Dodaj" (submit) formularza dodawania
        addTaskForm.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const date = evt.target.dataset.date;
            const time = evt.target.querySelector('[name="addTaskForm__time"]').value;
            console.log(time);
            tasks.addTask('testAdd', date, time);
            tasks.showInConsole();
            console.table(tasks.getTasksOfDay(date));
        });

    }
}

const app = new App();

