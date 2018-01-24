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

        // obsługa przycisku zamknięcia panelu dnia
        this.parentDomElement.querySelector('.dayView__close').addEventListener('click', () =>{
            this.hide();
        });
        
    }

    show(date){
        this.parentDomElement.classList.remove('dayView--hidden');
        const dayHeader = this.parentDomElement.querySelector('h1');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dayHeader.innerText = new Intl.DateTimeFormat('pl-PL', options).format(date);
    }

    hide(){
        this.parentDomElement.classList.add('dayView--hidden');
    }
}

class App{
    constructor(){
        const calendarView = new CalendarView(document.querySelector('.calendarView'));
        // calendarView.setCalendarDate(2018,5);
        const day = new Day(document.querySelector('.dayView'));

        // zdarzenia wyboru roku i miesiąca
        const monthPicker = document.querySelector('select[name="month"]');
        const yearPicker = document.querySelector('select[name="year"]');
        monthPicker.addEventListener('change', () => calendarView.setCalendarDate(yearPicker[yearPicker.selectedIndex].value, monthPicker[monthPicker.selectedIndex].value));
        yearPicker.addEventListener('change', () => calendarView.setCalendarDate(yearPicker[yearPicker.selectedIndex].value, monthPicker[monthPicker.selectedIndex].value));
    }
}

const app = new App();

