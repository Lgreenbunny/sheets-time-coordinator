const hourToMilli = 60*60*1000;

function testCoordinator(){
  const discSheet = SpreadsheetApp.openById("1CfbjheGx5yNpoWbO7DldzqbEjVDycIfPtsMuQuZKjlM").getSheetByName("Discord labels");
  var offsets = discSheet.getRange("A3:A").getValues();
  var times = discSheet.getRange("B3:G").getValues();
  timeCoordinator(offsets, times);
}

async function timeCoordinator(offsets, times){
	const results = [];
	
	//adjust time values
	for(var i = 0; i < offsets.length; i++){
    //for the date to be neutral for every computer that uses it, the time should start at UTC then have the offset applied to it
    //the text inside the times column is plain text, but apps script won't ignore your timezone unless you use Date.UTC or Date.Parse)
    //leave a gap
    var theOff = offsets[i][0];
    //making sure that it doesn't treat a 0 as a blank entry
    if(theOff == "" && theOff != 0 && theOff != "0")
      results.push([""]);

    //calculate time
    else{
      //make a UTC-based time Date.UTC, converting the blanks into 0's & handling the month issue
      let temp = await timeMaker(times[i]);
      let off = Number(theOff)*-1;

      //add the inverse of the offset time to the current times, and add it to the result
      //temp.setTime(temp.getTime() + (off * hourToMilli));
      temp += off * hourToMilli;

      //discord may use a seconds-based timestamp instead of the entire millisecond timestamp
      results.push([temp/1000]);//
    }
	}
	
	return results;
}

function timeMaker(times){
  return new Promise((resolve)=>{
    const parsedArr = [];
  
    for(var i = 0; i < times.length; i++){
      var temp = times[i];
      if(temp == "")
        parsedArr.push(0);
      else{
        parsedArr.push(Number(temp) - (i == 1? 1 : 0))
      }
    }

    const parsedTime = Date.UTC(...parsedArr);
    resolve(parsedTime);
  });
}

/*
Date.UTC(...(times
    .map((e,i)=>{
      if(e == "")
        return 0;
      else{//if it's the month, it starts at 0 for the UTC parameter, so if the person types 1 for january, it should be 0
        return Number(e) - (i == 1? 1 : 0);
      }
    })
  )));
 */