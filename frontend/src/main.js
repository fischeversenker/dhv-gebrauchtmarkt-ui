(async function () {
  'use strict';

  const response = await fetch('https://www.dhv.de/db3/service/gebrauchtmarkt/anmelden');
  console.log(response.body());
})();
