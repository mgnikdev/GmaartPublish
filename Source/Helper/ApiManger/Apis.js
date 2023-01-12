// export const baseApiUrl = 'http://139.59.93.229:8069/';
///Test Base url
// export const baseApiUrl = 'http://139.59.0.32:8059/';
export const baseApiUrl = 'http://139.59.61.179:8069/';
export const POST = (apiName, raw) => {
  console.log('apiname', apiName);
  return new Promise((resolve, reject) => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    fetch(baseApiUrl + apiName, requestOptions)
      .then(response => response.json())
      .then(result => {
        resolve(result);
        // reject(result.error);
        // console.log(result);
      })
      .catch(error => console.log('error', error));
  });
};
