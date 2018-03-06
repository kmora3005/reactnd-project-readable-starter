export const guid=()=> {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
  
const s4=()=> {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

export const formattedDate=(timestamp)=> {
  const date = new Date(timestamp)
  const monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const formattedDate=day + ' ' + monthNames[monthIndex] + ' ' + year;
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();
  const seconds = "0" + date.getSeconds();
  const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  return formattedDate+" "+formattedTime
}

export const getCategoryFromLocation=(location)=> {
  const urlSplitted = location.pathname.replace('post/create','').replace('/comment/create','').split('/')
  return urlSplitted[1]
}

export const getIdPostFromLocation=(location)=> {
  const urlSplitted = location.pathname.replace('post/create','').replace('/comment/create','').split('/')
  return urlSplitted[2]
}

export const getIdCommentFromLocation=(location)=> {
  const urlSplitted = location.pathname.replace('post/create','').replace('/comment/create','').split('/')
  return urlSplitted[3]
}