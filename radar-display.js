
var number_images = 9
var radar_ID = "IDR033z"
var radar_URL = "http://www.bom.gov.au/radar/" + radar_ID + ".T."
var radar_URL_extension = ".png"
var radar_images = []
var radar_image_index = number_images - 1

function update_radar_image_sources() {
    currentDate = moment.utc()
    year = currentDate.year()
    month = currentDate.month()
    day = currentDate.date()
    hour = currentDate.hour()
    // Radar images happen on */6 in cron speak
    minute = Math.floor(currentDate.minute() / 6) * 6
    current_image_time = moment.utc([year, month, day, hour, minute])
    
    radar_images = []

    for (i = 0; i < number_images; i++) {

        var new_URL = radar_URL + current_image_time.format("YYYYMMDDHHmm") + radar_URL_extension
        radar_images.push(new_URL)
        
        current_image_time = current_image_time.subtract(6, 'minutes')
    }
    setTimeout(update_radar_image_sources, 360000);
}

function swap_radar_image() {
    //console.log("Called with radar_image_index: " + radar_image_index)
    document.getElementById('radar-top').src = radar_images[radar_image_index]
    radar_image_index = radar_image_index - 1
    if (radar_image_index < 1) {
        radar_image_index = number_images - 1
        setTimeout(swap_radar_image, 4000)
    } else {
        setTimeout(swap_radar_image, 1000)
    }
}



