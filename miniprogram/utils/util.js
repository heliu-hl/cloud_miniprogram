


//判断一个变量是否为空
export function isVarEmpty(v) {
  switch (typeof v) {
    case 'undefined':
      return true;
    case 'string':
      if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
      break;
    case 'boolean':
      if (!v) return true;
      break;
    case 'number':
      if (0 === v || isNaN(v)) return true;
      break;
    case 'object':
      if (null === v || v.length === 0) return true;
      for (var i in v) {
        return false;
      }
      return true;
  }
  return false;
}

export const showMes = (title, icon) => {
  wx.showToast({
    title: title,
    icon: icon ? icon : 'none',
    duration: 2000
  })
}

/**
 * 将时间戳或者中国标准时间或时间戳处理成 2018-05-01 00:00:00  这种格式
 * @param {时间戳或者中国标准时间} timestamp 
 * @param {一状态 } state   time要时分秒  date或者不传不要时分秒  week要星期几 不要时分秒
 */

export function timestampToTime(timestamp,state) {
  let date = new Date(timestamp);
  const weeks = ["星期天","星期一","星期二","星期三","星期四","星期五","星期六"];
  let year = date.getFullYear();
  let week =  date.getDay();
  let month = (date.getMonth()+1)<10?"0"+(date.getMonth()+1):date.getMonth()+1;
  let day = date.getDate()<10?"0"+date.getDate():date.getDate();
  let hours = date.getHours()<10?"0"+date.getHours():date.getHours();
  let minutes = date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
  let  seconds = date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds();
  return state =="time" ? year+"-"+month+"-"+day+"\xa0"+hours+":"+minutes+":"+seconds+"\xa0"+weeks[week]:state=="week"?year+"-"+month+"-"+day+"\xa0"+weeks[week]:year+"-"+month+"-"+day;
}

/**
 * 日期格式化（补全）
 * 把2020-6-8转换为2020-06-08
 * 
*/
export function dateFormat(year,month,day){
  month = month.toString().length==1?"0"+month:month;
  day = day.toString().length==1?"0"+day:day;
  return year+"-"+month+"-"+day
}



  // 当前日期减去一天
  export function preDate(time) {
    let timeStamp = Date.parse(new Date(time))
    timeStamp = timeStamp / 1000
    timeStamp -= 86400;   //减去一天
    let newTime = new Date(timeStamp * 1000)
    return newTime;
  }
    // 当前日期加一天
  export function lastDate(time) {
    let timeStamp = Date.parse(new Date(time))
    timeStamp = timeStamp / 1000
    timeStamp += 86400;   //加上一天
    let newTime = new Date(timeStamp * 1000)
    return newTime;
  }



