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
                } 
                else {
                    return [];
                }
            }

            function getDirectChildDivIds() {
                const calendarContainer = document.getElementById('calendar-container');
                if (calendarContainer) {
                    const childDivs = Array.from(calendarContainer.children).filter(child => child.tagName === 'DIV');
                    return childDivs.map(div => div.id);
                } 
                else {
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

        // Cerrar instancia de Puppeteer
        await browser.close();

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
                    dates.push(new Date(year, monthMapping[key]-1, day));
                });
            }
        }

        // Agregar el 1 de enero del año siguiente
        const nextYearNewYear = new Date(Number(year) + 1, 0, 1);

        // Concatenar todas las fechas
        const allHolidays = [...dates, nextYearNewYear];

        return {allHolidays, error:''};
        
      } catch (error) {
        // Cerrar instancia de Puppeteer
        await browser.close();
        // Si el tiempo se agota y el elemento no aparece, se captura el error
        return {result:[], error};
      }
}


module.exports = {
    getHolidays,
}