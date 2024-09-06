const puppeter = require('puppeteer')

async function getHolidays(year) {
    
    
    try {
        const browser = await puppeter.launch({headless:true});
        const page = await browser.newPage();
        console.log('Ingresando a feriados Argentina..')
        await page.goto('https://www.argentina.gob.ar/interior/feriados-nacionales-' + year);
        // Espera a que el div con id 'mEnero' esté presente en el DOM
        await page.waitForSelector('#mEnero', {timeout: 5000});

        // Ejecuta el script en el contexto del navegador para extraer los textos
        const allTextsByDivId = await page.evaluate(() => {
            function getParagraphTextsInDiv(divId) {
            const targetDiv = document.getElementById(divId);
            if (targetDiv) {
                const paragraphs = targetDiv.getElementsByTagName('p');
                return Array.from(paragraphs).map(p => p.textContent);
            } else {
                return [];
            }
            }

            function getDirectChildDivIds() {
            const calendarContainer = document.getElementById('calendar-container');
            if (calendarContainer) {
                const childDivs = Array.from(calendarContainer.children).filter(child => child.tagName === 'DIV');
                return childDivs.map(div => div.id);
            } else {
                return [];
            }
            }

            function getAllParagraphTextsByDivId() {
            const childDivIds = getDirectChildDivIds();
            const paragraphsByDivId = {};
            childDivIds.forEach(id => {
                const paragraphTexts = getParagraphTextsInDiv(id);
                paragraphsByDivId[id] = paragraphTexts;
            });
            return paragraphsByDivId;
            }

            const allTextsByDivId = getAllParagraphTextsByDivId();
            return allTextsByDivId;
        });

        // Proceso de extracción de fechas
        const regex = /\([a-zA-Z]\)/;
        const monthMapping = {
            mEnero: "01",
            mFebrero: "02",
            mMarzo: "03",
            mAbril: "04",
            mMayo: "05",
            mJunio: "06",
            mJulio: "07",
            mAgosto: "08",
            mSeptiembre: "09",
            mOctubre: "10",
            mNoviembre: "11",
            mDiciembre: "12"
        };

        let dates = [];

        for (const key in allTextsByDivId) {
            if (allTextsByDivId.hasOwnProperty(key)) {
            const filteredValues = allTextsByDivId[key].filter(value => !regex.test(value));
            const splitValues = filteredValues.flatMap(value => value.split(/[.,]/).map(str => str.trim()));
            const numericValues = splitValues.filter(value => !isNaN(value) && value.trim() !== '');
            numericValues.forEach(day => {
                const month = monthMapping[key];
                const formattedDate = `${String(day).padStart(2, '0')}/${month}/${year}`;
                dates.push(formattedDate);
            });
            }
        }

        // Función para generar todos los sábados y domingos de un año
        function getWeekends(year) {
            let weekends = [];
            let date = new Date(year, 0, 1); // Empieza el 1 de enero del año dado
            // Recorre cada día del año
            while (date.getFullYear() == year) {
            // Si es sábado (6) o domingo (0)
            if (date.getDay() === 0 || date.getDay() === 6) {
                // Formatear la fecha como dd/mm/yyyy
                let formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${year}`;
                weekends.push(formattedDate);
            }
            // Pasar al día siguiente
            date.setDate(date.getDate() + 1);
            }
            return weekends;
        }

        const weekends = getWeekends(year);

        // Agregar el 1 de enero del año siguiente
        const nextYearNewYear = `01/01/${Number(year) + 1}`;

        // Concatenar todas las fechas
        const allHolidays = [...dates, ...weekends, nextYearNewYear]; 

        await browser.close();
        return {allHolidays, error:''};
        
      } catch (error) {
        // Si el tiempo se agota y el elemento no aparece, se captura el error
        return {result:[], error};
      }
}

module.exports = {
    getHolidays,
}