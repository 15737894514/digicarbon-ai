myForm Attributes

参数 说明 类型 可选值 默认值
参数:span 说明:占位(优先级低于内部的 span) 类型: Number 可选值:-- 默认值:24

参数:labelWidth 说明:表单域标签的的宽度 类型: string 可选值:-- 默认值:auto

searchBox:展示重置和搜素按钮 格式 searchBox:{span:6,style:{},reset:true}//reset 表示重置按钮是否展示 style:{"text-align":"center"}等内容

gutter:间距
rules:表单验证规则 类型：array
ruleForm:数据 类型：object
formValidateData/formData:form 表单的数据 类型：array
disabledProp:失效的表单 类型:object 例如:disabledProp:{字段名:Boolean}
hideProp:隐藏表单 格式如上
optionData:选择器数据 格式如上

数据格式 例如
formData:[{
type: "text",//类型 有（text,textarea,checkbox,radio,upload,timePicker,select/option,"year","month","date","dates","week","datetime","datetimerange","daterange","monthrangenge","daterange","datetimera"）
label: "域名",//标签文本
prop: "domain",//字段名
span: 6,//栅格占据的列数 默认值是 24
blur:($event)=>{},
change:($event)=>{}
......
}]

注：其他属性可以查看 element-ui 组件 formData 里面的 type 类型去使用，是一致的
例如：
type:text 你直接查看组件 input 输入框就可以了;
type:select,查看 select 选择器组件
