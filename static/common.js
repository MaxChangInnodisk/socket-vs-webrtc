const DOMAIN = "172.16.92.130";
const PORT = "4444";


const SCRIPT_ROOT = `http://${DOMAIN}:${PORT}`;


const LOG               = "log"
const JSON_FMT          = "JSON"
const FORM_FMT          = "form"

const ALERT             = "alert"
const CONSOLE           = "console"


async function parseError(xhr){
    err = xhr.responseText;
    if( err.includes("[") && err.includes("]")){
        err = err.slice(err.search("\\["), -1)
    }
    return err
}


async function alertError (xhr, _textStatus, _errorThrown) {
    const errMsg = await parseError(xhr);
    alert( errMsg );
    return( errMsg );
}

async function logError (xhr, _textStatus, _errorThrown) {
    const errMsg = await parseError(xhr);
    console.log( errMsg );
    return( errMsg );
}

async function getAPI(api, errType=LOG, log=false, pureURL=false) {

    let trg_api = api;
    if(pureURL===false) trg_api = SCRIPT_ROOT + api;

    if(log) console.log(`[GET] Called API: ${api}`);

    // Setup error event
    let errEvent;
    if (errType === ALERT) errEvent = alertError;
    else errEvent = logError;

    

    // Call API
    const data = await $.ajax({
        url: trg_api,
        type: "GET",
        dataType: "json",
        error: errEvent
    });
    // Return Data
    if (data) return data;
    else return(undefined);
}

async function postAPI(api, inData, inType=JSON_FMT, errType=LOG, pureURL=false) {
    
    let trg_api = api;
    if(pureURL===false) trg_api = SCRIPT_ROOT + api;
    

    // Setup error event
    let errEvent
    let retData;
    if (errType === ALERT) errEvent = alertError;
    else errEvent = logError;

    // Call API
    if(inType===FORM_FMT){
        retData = await $.ajax({
            url: trg_api,
            type: "POST",
            data: inData,
            processData: false,
            contentType: false,
            error: errEvent
        });    
    }

    if(inType===JSON_FMT){
        retData = await $.ajax({
            url: SCRIPT_ROOT + api,
            type: "POST",
            data: JSON.stringify(inData),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            error: errEvent
        });    
    }

    // Return Data
    if (retData) return retData;
    else return(undefined);
}
