import './App.css';
import React, { Component} from 'react';
import MainDashboardVideo from './Assets/MainVideoDashboard.mp4'
import sidePanel from './Assets/SideBarWebsite.png'
import mosqueTimes from './mosqueTimes.json'

export default class MainApp extends Component {

  constructor(props){
    super(props);
    this.state ={
      count:1,
      PrayerNames:['Fajr','Sunrise','Zuhur','Asr','Maghrib','Isha'],
      arabicPrayerNames:['فجر','شروق','زهور','عصر','مغرب','عشاء'],
      dynamicSwitchCounter:0,
      currentDynamicArea:'ClockDate',
      switchToArabic:false,
      languageSwitchCouter:0,
      holdNextPrayer:false,
      holdCounter:0,
      dynamicSwitchMax:20,
      arabicSwitchMax:10
    }
  }
  
  makePrayerList(){

    var prayerLists = []
    
    this.state.PrayerNames.forEach(function(prayerName){

      var prayerItem;

      if (prayerName=='Sunrise'){
        prayerItem = (
          <div id={prayerName} className='PrayerTime'>
            <div id={prayerName+'Body'} className='PrayerBody'>
              <div id={prayerName+'Label'} className='PrayerName'>
                <p id ={prayerName+'LabelText'} className='PrayerNameText'>{prayerName}</p>
              </div>
              <div id={prayerName+'Start'} className='PrayerStart'>
                <p id ={prayerName+'StartText'} className='PrayerStartText'></p>
              </div>
              <div id={prayerName+'Jamat'} className='PrayerJamat'>
                <p id ={prayerName+'JamatText'} className='PrayerJamatText'>-- : --</p>
              </div>
            </div>
          </div>
        )
      }
      else{
        prayerItem = (
          <div id={prayerName} className='PrayerTime'>
            <div id={prayerName+'Body'} className='PrayerBody'>
              <div id={prayerName+'Label'} className='PrayerName'>
                <p id ={prayerName+'LabelText'} className='PrayerNameText'>{prayerName}</p>
              </div>
              <div id={prayerName+'Start'} className='PrayerStart'>
                <p id ={prayerName+'StartText'} className='PrayerStartText'></p>
              </div>
              <div id={prayerName+'Jamat'} className='PrayerJamat'>
                <p id ={prayerName+'JamatText'} className='PrayerJamatText'></p>
              </div>
            </div>
          </div>
        )
      }



      prayerLists.push(prayerItem)

    })

    return prayerLists

  }

  updateNextPrayer(nextPrayer){
    var now = new Date();
    var nextPrayerName = nextPrayer.Name
    var nextPrayerType = nextPrayer.Type
 
    var displayTime = this.nextPrayerTimeDifference(nextPrayer)

    // if(switchToArabic){
    //   var arabicName;

    //   for (var i=0;i<PrayerNames.length;i++){
    //     if (PrayerNames[i]==nextPrayerName){
    //       arabicName = arabicPrayerNames[i]
    //       break;
    //     }
    //   }
    //   document.getElementById('NextPrayerNameLabel').style.fontSize= '2.5vw'  
    //   document.getElementById('NextPrayerNameLabel').innerText= arabicName
    // }
    // else{
      document.getElementById('NextPrayerNameLabel').innerText= nextPrayerName  
      document.getElementById('NextPrayerNameLabel').style.fontSize= '2.85vw'  
    // }
    document.getElementById('NextPrayerTypeLabel').innerText=nextPrayerType +' in'
    document.getElementById('NextPrayerTimeLabel').innerText=displayTime
  }

   updatePrayerList(){

    var todayTimes=mosqueTimes.filter( element => element.Date == this.getTodaysDate())[0]
    
    this.state.PrayerNames.forEach(function(prayerName) {
      if (prayerName =='Sunrise'){
        document.getElementById('SunriseStartText').innerText=(todayTimes[prayerName]).substring(0,5)
      }
      else{
        document.getElementById(prayerName+'StartText').innerText=(todayTimes[prayerName+' Start']).substring(0,5)
        document.getElementById(prayerName+'JamatText').innerText=(todayTimes[prayerName+' Jamat']).substring(0,5)
      }
    })

    var currentPrayer=this.getCurrentPrayer(todayTimes)

    var backgroundColours=this.getBackgroundColours(currentPrayer.Name)
    backgroundColours.forEach(function(prayer){
        document.getElementById(prayer.Name).style.backgroundColor=prayer.Background
        document.getElementById(prayer.Name+'Jamat').style.backgroundColor=prayer.Jamat
        document.getElementById(prayer.Name+'LabelText').style.color=prayer.MainText
        document.getElementById(prayer.Name+'StartText').style.color=prayer.MainText
        document.getElementById(prayer.Name+'JamatText').style.color=prayer.JamatText
    })

    var now=new Date()
    var hours;
    var minutes;
    
    if(now.getHours()<10){
      hours='0'+now.getHours()
    }
    else{
      hours = now.getHours()
    }

    if(now.getMinutes()<10){
      minutes='0'+now.getMinutes()
    }
    else{
      minutes = now.getMinutes()
    }

    if (this.state.currentDynamicArea == 'ClockDate'){
      document.getElementById('NextPrayerArea').style.display='none'
      document.getElementById('DateTimeArea').style.display='flex'
      document.getElementById('Time').innerText=hours+ ':' +minutes
      // if (switchToArabic){
      //document.getElementById('Date').innerText=getIslamicDate()
      //document.getElementById('Date').style.fontSize='1.3vw'
      // }
      // else{
      document.getElementById('Date').innerText=this.getLongDate()
      document.getElementById('Date').style.fontSize='1.7vw'
      // }
      this.setState({dynamicSwitchCounter:this.state.dynamicSwitchCounter+1})
      //will force switch to prayer countdown if needed
      this.nextPrayerTimeDifference(this.getNextPrayerTime(todayTimes))
    }
    else{
      document.getElementById('DateTimeArea').style.display='none'
      document.getElementById('NextPrayerArea').style.display='flex'
      // if (holdNextPrayer == true){
      //   dynamicSwitchCounter = 0
      //   document.getElementById('NextPrayerTimeLabel').innerText='Progress'
      //   if (holdCounter == 15){
      //     holdNextPrayer = false
      //     dynamicSwitchCounter=9
      //     holdCounter=0
      //   }
      //   else{
      //     holdCounter++
      //   }
      // }
      // else{
        this.updateNextPrayer(this.getNextPrayerTime(todayTimes))
      // }
      this.setState({dynamicSwitchCounter:this.state.dynamicSwitchCounter+1})
    }

    
    if(this.state.dynamicSwitchCounter==this.state.dynamicSwitchMax){
      this.setState({dynamicSwitchCounter:0})
      if(this.state.currentDynamicArea == 'ClockDate'){
        this.setState({currentDynamicArea:'NextPrayer'})
      }
      else{
        this.setState({currentDynamicArea:'ClockDate'})
      }
    }
  }

  getTodaysDate() {
    const today = new Date();

    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const formattedDate = day + '/' + month + '/' + year;
    return formattedDate;
  }

  getCurrentPrayer(times){

    var now = new Date();
    var currentPrayer;

    for (var i=0; i < this.state.PrayerNames.length;i++){

      if(this.state.PrayerNames[i]=='Fajr'){
        if (now<new Date(now.toDateString() + ' ' + times['Fajr Start'])){
            currentPrayer={'Name':'All','Index':i}
            break;
        }
      }

      if (now >= new Date(now.toDateString() + ' ' + times['Sunrise']) && now < new Date(now.toDateString() + ' ' + times['Zuhur Start'])){
        
        var now = new Date();
        var sunriseTime = new Date(now.toDateString() + ' ' + times['Sunrise'])
        var timeDiff = now-sunriseTime;
    
        var hours = Math.floor(timeDiff / (1000 * 60 * 60));

        if (hours > 0){
          currentPrayer={'Name':'PastSunrise','Index':i}
        }
        else{
          currentPrayer={'Name':'Sunrise','Index':i}
        }
        break;
      }
      else{
        var startTime;
        var nextTime;

        if(this.state.PrayerNames[i]=='Fajr'){
          startTime = new Date(now.toDateString() + ' ' + times[this.state.PrayerNames[i]+' Start'])
          nextTime = new Date(now.toDateString() + ' ' + times['Sunrise'])
        }
        else if (this.state.PrayerNames[i]=='Sunrise'){
          startTime = new Date(now.toDateString() + ' ' + times[this.state.PrayerNames[i]])
          nextTime = new Date(now.toDateString() + ' ' + times[this.state.PrayerNames[i+1]+ ' Start'])
        }
        else if(this.state.PrayerNames[i]=='Isha'){
          currentPrayer={'Name':this.state.PrayerNames[i],'Index':i}
          break;
        }
        else{
          startTime = new Date(now.toDateString() + ' ' + times[this.state.PrayerNames[i]+' Start']);
          nextTime = new Date(now.toDateString() + ' ' + times[this.state.PrayerNames[i+1]+ ' Start']);
        }
        if (now>startTime && now<nextTime){
          currentPrayer={'Name':this.state.PrayerNames[i],'Index':i}
          break;
        }
      }
    }
    return currentPrayer
  }

  getBackgroundColours(currentPrayer){

    var prayerColours = []
    var passedCount = 0

    if (currentPrayer=='All'){
      this.state.PrayerNames.forEach(function(prayerName){
        prayerColours.push({'Name':prayerName,'Background':'darkgray','Jamat':'lightslategrey','JamatText':'Azure','MainText':'Ghostwhite'})
      })
    }
    else if(currentPrayer == 'PastSunrise'){
      for (var i=0; i<this.state.PrayerNames.length;i++){
        if (this.state.PrayerNames[i]=='Fajr' || this.state.PrayerNames[i]=='Sunrise'){
          prayerColours.push({'Name':this.state.PrayerNames[i],'Background':'dimgrey','Jamat':'grey','JamatText':'dimgrey','MainText':'grey'})
        }
        else{
          prayerColours.push({'Name':this.state.PrayerNames[i],'Background':'darkgray','Jamat':'lightslategrey','JamatText':'Azure','MainText':'Ghostwhite'})
        } 
      }
    }
    else{
      for (var i=0; i<this.state.PrayerNames.length;i++){
        if (this.state.PrayerNames[i] == currentPrayer){
          prayerColours.push({'Name':this.state.PrayerNames[i],'Background':'cadetblue','Jamat':'burlywood','JamatText':'Azure','MainText':'Ghostwhite'})
          break;
        }
        else{
          passedCount++;
        }
      }
      
      for (var i=0; i<passedCount;i++){
        prayerColours.push({'Name':this.state.PrayerNames[i],'Background':'dimgrey','Jamat':'grey','JamatText':'dimgrey','MainText':'grey'})
      }
      for (var i=passedCount+1;i<this.state.PrayerNames.length;i++){
        prayerColours.push({'Name':this.state.PrayerNames[i],'Background':'darkgray','Jamat':'lightslategrey','JamatText':'Azure','MainText':'Ghostwhite'})
      }
    }
    return prayerColours
  }
  
  getNextPrayerTime(times) {

    var now = new Date();
    var nextPrayerTime;

    for (var i = 0; i < this.state.PrayerNames.length; i++) {

      if (this.state.PrayerNames[i]=='Sunrise'){
        var sunrise = new Date(now.toDateString() + ' ' + times[this.state.PrayerNames[i]]);
        if (sunrise > now) {
          nextPrayerTime = {'Name':this.state.PrayerNames[i],'Type': 'Begins','Time':sunrise};
          break;
        }
      }
      else{
        var startTime = new Date(now.toDateString() + ' ' + times[this.state.PrayerNames[i]+' Start']);
        var jamatTime = new Date(now.toDateString() + ' ' + times[this.state.PrayerNames[i]+' Jamat']);
        
        if (startTime > now){
          nextPrayerTime = {'Name':this.state.PrayerNames[i],"Type": 'Starts','Time':startTime};
          break;
        }
        else if (jamatTime > now) {
          nextPrayerTime = {'Name':this.state.PrayerNames[i], 'Type': 'Jamat','Time':jamatTime};
          break;
        }
        if(this.state.PrayerNames[i]=='Isha'&&nextPrayerTime==undefined){
          const today = new Date()
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)
          var month= (tomorrow.getMonth())+1
          var date = tomorrow.getDate()

          if (month<10){
            month = '0'+month
          }

          if (date<10){
            date = '0'+date
          }

          var tomorrowDate=date+'/'+month+'/'+tomorrow.getFullYear()
   
          var tomorrowTimes=mosqueTimes.filter( element => element.Date == tomorrowDate)[0]

          var tomorrowPrayer =new Date(tomorrow.toDateString() + ' ' + tomorrowTimes['Fajr Start']);
          nextPrayerTime = {'Name':'Fajr','Type':'Prayer','Time':tomorrowPrayer};
        }
      }
    }

    return nextPrayerTime;
  }

  getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
      return 'th';
    } else {
      const lastDigit = day % 10;
      switch (lastDigit) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    }
  }

  getLongDate(){
    const today = new Date();
    const day = today.getDate();
    var suffix = this.getDaySuffix(day);
    const month = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear();

    const formattedDate = this.getDayOfWeek(today) + '\n ' + day + suffix + ' ' + month + ' ' + year;
    return formattedDate;
  }


  getDayOfWeek(date) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
  }

  nextPrayerTimeDifference(nextPrayer){
    var now = new Date();
    var nextPrayerTime = nextPrayer.Time
    var timeDiff = nextPrayer.Time - now;
    var displayTime
 
    var hours = Math.floor(timeDiff / (1000 * 60 * 60));
    if (hours<10){
      hours = '0'+hours
    }

    var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    if (minutes<10){
      minutes='0'+minutes
    }

    var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    if (seconds<10){
      seconds='0'+seconds
    }

    if (hours>0){
      displayTime= hours + ':' + minutes + ':' + seconds;
    }
    else if(hours==0 &&minutes>=1)(
      displayTime = minutes + ':' + seconds
    )
    else if(seconds>=0){
      displayTime = seconds+'s';
      this.setState({currentDynamicArea:'NextPrayer',dynamicSwitchCounter:0})
    }
    return displayTime
  }

  componentDidMount(){
    this.interval = setInterval(() => this.updatePrayerList(), 1000);
  }

  render(){
      return (
        <div id="Main">
          <div id="MainPanel">
            <div id="Top">
             <video id='MainVideo' width="100%" height="99.5%" autoPlay={true} loop={true} muted={true}>
                <source src={MainDashboardVideo} type="video/mp4" />
            </video>
           </div>
          <div id="Bottom">
            <div id="PrayerList">
              <div id="NextPrayerArea">
                <div id='NextPrayerName'>
                  <div id="NextPrayer-Name">
                    <p id="NextPrayerNameLabel"></p>
                  </div>
                  <div id="NextPrayer-Type">
                    <p id="NextPrayerTypeLabel"></p>
                  </div>
                </div>
                <div id='NextPrayerTime'>
                  <p id="NextPrayerTimeLabel"></p>
                </div>
              </div>
              <div id="DateTimeArea">
                <div id='CurrentDate'>
                  <p id="Date"></p>
                </div>
                <div id='CurrentTime'>
                  <p id="Time"></p>
                </div>
              </div>
              {this.makePrayerList()}
            </div>
          </div>
        </div>
        <div id="SidePanel">
          <img src={sidePanel} width="100%" height="100%" id="'Logo"></img>
        </div>
      </div>
    );
  }
}
