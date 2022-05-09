let db

const request = indexDB.open('tracker', 1)

// will onyl run first time db is ceated or unless browser change
request.onupgradeneeded = function(e) {
    const db = e.target.result

    db.createObjectStore('budget_data', {autoIncrement: true})
}

request.onsuccess = function (e) {

    db = e.target.result

    if(navigator.onLine){
        saveData()
    }


}

request.onerror = function (e) {
    console.log(e.target.errorCode)
}

function saveRecord(record){
    const transaction = db.transaction (['budget_data'], 'readwrite')

    const dataObjectStore = transaction.objectStore('budget_data')

    dataObjectStore.add(record)
}