//全局配置的数据
let inputTxt = "请输入";
let selectTxt = "请选择";
let remark = "备注";
export const config = {
  sessionDefault: "Session-default",
  input: inputTxt,
  remark,
  select: selectTxt,
  time: selectTxt,

  startTime: "开始时间",
  endTime: "结束时间",
  selTime: "选择时间",
  to: "至",
  validationFailText: "保存失败，有必填项未填写",
  labelStyle: { width: "80px", "text-align": "left", color: "#555" },
  contentStyle: { "text-align": "left", display: "inline-block", color: "#333" },
  inputRule: [{ required: true, message: inputTxt, trigger: "blur" }],
  selectRule: [{ required: true, message: selectTxt, trigger: "blur" }],
  inputRuleHandle: (trigger = "change") => {
    return [{ required: true, message: inputTxt, trigger }];
  },
  selectRuleHandle: (trigger = "change") => {
    return [{ required: true, message: selectTxt, trigger }];
  },
};
