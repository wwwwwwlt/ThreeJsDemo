
var PLANE_LENGTH = 60;  //货架板面长度
var PLANE_WIDTH = 100;   //货架板面宽度
var PLANE_HEIGHT = 2;   //货架板面高度
var HOLDER_LENGTH = 2;  //支架长度
var HOLDER_WIDTH = 2;   //支架宽度
var HOLDER_HEIGHT = 50; //支架高度
var LAYER_NUM = 3;      //货架层数
var COLUMN_NUM = 2;     //货架每层列数
var BOX_SIZE = 30;      //货物的大小(立方体)

var shelf_list=[
    {storageZoneId:'Z1',shelfId:'A1',shelfName:'货架A1',y:40,},
    {storageZoneId:'Z1',shelfId:'A2',shelfName:'货架A2',y:40,},
    {storageZoneId:'Z1',shelfId:'A3',shelfName:'货架A3',y:40,},
    {storageZoneId:'Z1',shelfId:'A4',shelfName:'货架A4',y:40,},
    {storageZoneId:'Z1',shelfId:'A5',shelfName:'货架A5',y:40,},
    {storageZoneId:'Z1',shelfId:'A6',shelfName:'货架A6',y:40,},
    {storageZoneId:'Z1',shelfId:'A7',shelfName:'货架A7',y:40,},
]

function GET_SHELF_LIST(){
  return shelf_list
}

function GET_PLANE_LENGTH(){
  return PLANE_LENGTH;
}

function GET_PLANE_WIDTH(){
  return PLANE_WIDTH;
}

function GET_PLANE_HEIGHT(){
  return PLANE_HEIGHT;
}

function GET_HOLDER_LENGTH(){
  return HOLDER_LENGTH;
}

function GET_HOLDER_WIDTH(){
  return HOLDER_WIDTH;
}

function GET_HOLDER_HEIGHT(){
  return HOLDER_HEIGHT;
}

function GET_LAYER_NUM(){
  return LAYER_NUM;
}

function GET_COLUMN_NUM(){
  return COLUMN_NUM;
}

function GET_BOX_SIZE(){
  return BOX_SIZE;
}

