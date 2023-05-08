(async() => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let result;
    try {
        [{ result }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => document.documentElement.innerHTML, // use innerHTML instead of innerText
        });
    } catch (e) {
        document.body.textContent = 'Cannot access page';
        return;
    }
    // process the result
    const element = document.createElement('div'); // create a new div element
    element.innerHTML = result; // set the innerHTML of the div element to the result


    //const priceElems = result.querySelectorAll('span.ooa-1bmnxg7.evg565y11');



    // Initialize variables for calculating the average price, odometer reading, and year
    let totalPrices = 0;
    let totalOdometers = 0;
    let totalYears = 0;
    let count = 0;
    const priceElems = element.querySelectorAll('span.ooa-1bmnxg7.evg565y11');
    const odometerElems = element.querySelectorAll('ul.evg565y12.evg565y20.ooa-35c11y.er34gjf0 li.ooa-1k7nwcr.e19ivbs0:nth-of-type(2)');
    const yearElems = element.querySelectorAll('ul.evg565y12.evg565y20.ooa-35c11y.er34gjf0 li.ooa-1k7nwcr.e19ivbs0:nth-of-type(1)');

    const linkElement = element.querySelector('link[rel="canonical"]');
    const Name = linkElement.getAttribute('href').split('osobowe/')[1].split('?')[0].split('/')
    const capitalized_Name = Name.map(word => word.toUpperCase()).join(' ');






    for (let i = 0; i < priceElems.length; i++) {



        try {
            const price = parseFloat(priceElems[i].textContent.replace(/\D/g, ''));
            const odometer = parseInt(odometerElems[i].textContent.replace(/\D/g, ''));
            const year = parseInt(yearElems[i].textContent.replace(/\D/g, ''));
        } catch (e) {
            continue;
        }
        const price = parseFloat(priceElems[i].textContent.replace(/\D/g, ''));
        const odometer = parseInt(odometerElems[i].textContent.replace(/\D/g, ''));
        const year = parseInt(yearElems[i].textContent.replace(/\D/g, ''));



        // Add the price, odometer reading, and year to the total
        if (!isNaN(price) && !isNaN(odometer) && !isNaN(year)) {
            totalPrices += price;
            totalOdometers += odometer;
            totalYears += year;
            count++;
        }
    };


    // Calculate the average price, odometer reading, and year
    const avgPrice = count > 0 ? Math.round(totalPrices / count) : 0;
    const avgOdometer = count > 0 ? Math.round(totalOdometers / count) : 0;
    const avgYear = count > 0 ? Math.round(totalYears / count) : 0;


    // Update the summary table with the average values
    //document.getElementById('avg-price').textContent = avgPrice.toString();
    document.getElementById('make-n-model').textContent = capitalized_Name
    document.getElementById('avg-price').textContent = avgPrice.toString();
    document.getElementById('avg-odometer').textContent = avgOdometer.toString();
    document.getElementById('avg-year').textContent = avgYear.toString();
})();