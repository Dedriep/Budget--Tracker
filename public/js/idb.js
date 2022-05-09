let db

const request = indexedDB.open('tracker', 1)

// will onyl run first time db is ceated or unless browser change
request.onupgradeneeded = function(e) {
    const db = e.target.result

    db.createObjectStore('budget_data', {autoIncrement: true})
}

request.onsuccess = function (e) {

    db = e.target.result
// if online functionality run code to upload saved data
    if(navigator.onLine){
        getBudget()
    }


}

request.onerror = function (e) {
    console.log(e.target.errorCode)
}




function saveRecord(record){

    //opening up connection to store data
    const transaction = db.transaction (['budget_data'], 'readwrite')

    const dataObjectStore = transaction.objectStore('budget_data')

    dataObjectStore.add(record)
}

function getBudget() {
    const transaction =db.transaction(['budget_data'], readwrite)
    const dataObjectStore = transaction.objectStore('budget_data')
   
   //will get all info in idb, asynch function, so needs an event listener
    const getAll = dataObjectStore.getAll()

    //occurs if something in idb
    getAll.onsuccess = function () {

        //post info to db
        if (getAll.result.length > 0) {
            fetch('api/transaction', {
                method: 'POST',
                body:JSON.stringify(getAll.result),
                headers: {  
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'},
            })
            .then(response => response.json())

            // if error?
            .then(serverResponse => {
                if (serverResponse.message){
                    throw new error(serverResponse)
                }

                //opens transactions to accesses idb db and then clears db
                const transaction = db.transaction(['budget_data'], readwrite)
                const dataObjectStore = transaction.objectStore('budget_data')
                dataObjectStore.clear()

                alert('Budget has been updated with offline info')
            })
            .catch(err => {
                console.log(err)
            })
        }
    }
}

window.addEventListener('online', getBudget);
