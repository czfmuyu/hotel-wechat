var checkInDate = function (date) {
    // 接收日历数据
    var strs = new Array(); //定义一数组 
    strs = date.split("-"); //字符分割 
    for (var i = 0; i < strs.length; i++) {
        // console.log(strs[i]) //分割后的字符输出 
    }
    var checkInDate = strs[1] + '月' + strs[2] + '日'
    return checkInDate
}
var checkOutDate = function (date) {
    var strs = new Array(); //定义一数组 
    strs = date.split("-"); //字符分割 
    for (var i = 0; i < strs.length; i++) {
        // console.log(strs[i]) //分割后的字符输出 
    }
    var checkOutDate = strs[1] + '月' + strs[2] + '日'
    return checkOutDate
}
module.exports = {
    checkInDate: checkInDate,
    checkOutDate:checkOutDate
    // aa:aa
}
