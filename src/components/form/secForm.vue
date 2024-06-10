<template>
  <div class="form-validate">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      :label-width="labelWidth || 'auto'"
      :label-position="labelPosition"
      class="base-info-ruleForm"
      :class="{ 'label-top-sty': labelPositionTopClass }"
      v-bind="$attrs"
      @submit.native.prevent
    >
      <el-row :gutter="gutter || 20">
        <span class="form-v-box" v-for="(item, index) in collapseData || formValidateData || formData || []" :key="index">
          <el-col class="cls title" v-if="item.title" :span="24">
            {{ item.title }}
          </el-col>
          <el-col :style="item.style || 'margin: 10px 0'" v-if="item.type == 'custom' && !hideProp[item.prop]" :span="24">
            <slot :name="item.prop"></slot>
          </el-col>
          <!--el-alert alert警告组件 -->
          <el-col v-if="item.type === 'alert'" :span="24">
            <el-alert
              :title="item.title"
              :type="item.type"
              :description="item.description"
              :closable="item.closable"
              :center="item.center"
              :close-text="item.closeText"
              :show-icon="item.showIcon"
              :effect="item.effect"
              @close="item.close && item.close($event)"
            >
            </el-alert>
          </el-col>
          <!--type是slot 插槽 走这-->
          <el-col
            :class="['slot-btn', item.slotClass]"
            v-if="item.type === 'slot' && !hideProp[item.prop]"
            :span="item.span || span"
            :style="item.style || 'text-align:left;'"
          >
            <el-form-item v-if="item.label" :label="item.label" :prop="item.prop">
              <slot :data="ruleForm" :name="item.prop"></slot>
            </el-form-item>
            <!-- 自定义label样式 -->
            <el-form-item :prop="item.prop" v-else>
              <span slot="label">
                <slot :name="`${item.prop}Label`"></slot>
              </span>
              <slot :data="{ ruleForm, item }" :name="item.prop"></slot>
            </el-form-item>
          </el-col>
          <!-- type是operation 就是操作的按钮 比如保存，提交等直接走这里 -->
          <el-col
            class="operation-btn"
            v-if="item.type === 'operation' && !hideProp[item.prop]"
            :span="item.span || span"
            :style="item.style || 'text-align:center;'"
          >
            <el-form-item>
              <el-button
                v-for="(child, cIndex) in item.children"
                :icon="child.icon || item.icon"
                :type="
                  child.type ||
                  (buttonType.includes((child.title && child.title.replace(/\s*/g, '')) || (child.label && child.label.replace(/\s*/g, '')))
                    ? 'primary'
                    : '')
                "
                :key="cIndex"
                v-show="!(child.hide && child.hide(item))"
                :disabled="child.disabled || item.disabled"
                :loading="loadingProp[child.prop || child.field]"
                :circle="child.circle || item.circle"
                :round="child.round || item.round"
                :plain="child.plain || item.plain"
                @click="child.click && child.click('ruleForm')"
                >{{ child.title || child.label }}</el-button
              >
            </el-form-item>
          </el-col>
          <el-col :span="item.span || span" v-if="item.type == 'input-number' && !hideProp[item.prop]">
            <el-form-item :label="item.label" :prop="item.prop">
              <el-input-number
                :name="item.name"
                :max="item.max"
                :min="item.min"
                :step="item.step"
                :step-strictly="item.stepStrictly"
                :precision="item.precision"
                :controls="item.controls"
                :controls-position="item.controlsPosition"
                :label="item.label"
                :disabled="item.disabled || disabledProp[item.prop] || false"
                :placeholder="item.placeholder || config.input"
                v-model="ruleForm[item.prop]"
                @focus="item.focus && item.focus($event)"
                @blur="item.blur && item.blur($event)"
                @change="item.change && item.change($event)"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :class="item.class" :span="item.span || span" v-if="inputType.includes(item.type) && !hideProp[item.prop]">
            <el-form-item :label="item.label" :prop="item.prop">
              <el-input
                :show-word-limit="item.showWordLimit"
                :type="item.type"
                :maxlength="item.maxlength"
                :minlength="item.minlength"
                :clearable="clearableHandle(item.clearable)"
                :show-password="item.showPassword"
                :prefix-icon="item.prefixicon"
                :suffix-icon="item.suffixIcon"
                :rows="item.rows || 5"
                :autosize="item.autosize"
                :autocomplete="item.autocomplete"
                :name="item.name"
                :max="item.max"
                :min="item.min"
                :step="item.step"
                :resize="item.resize"
                :autofocus="item.autofocus"
                :form="item.form"
                :label="item.label"
                :tabindex="item.tabindex"
                :validate-event="item.validateEvent"
                :disabled="item.disabled || disabledProp[item.prop] || false"
                :placeholder="item.placeholder || config.input"
                v-model="ruleForm[item.prop]"
                @focus="item.focus && item.focus($event)"
                @blur="item.blur && item.blur($event)"
                @clear="item.clear && item.clear($event)"
                @change="item.change && item.change($event)"
                @input="(item.input && item.input($event)) || inputChange(item, ruleForm[item.prop])"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="item.span || span" v-if="item.type === 'checkbox'">
            <el-form-item :label="item.label" :prop="item.prop">
              <!-- 多选框组 -->
              <el-checkbox-group
                v-if="Array.isArray(ruleForm[item.prop])"
                v-model="ruleForm[item.prop]"
                :disabled="item.disabled || disabledProp[item.prop]"
                :min="item.min"
                :max="item.max"
                :text-color="item.textColor"
                :fill="item.fill"
                @change="(item.change && item.change($event)) || checkboxChange(ruleForm[item.prop], item.prop)"
              >
                <el-checkbox
                  v-for="(child, index) in item.option || item.options || item.optionData || optionData[item.prop] || []"
                  :label="child.value"
                  :key="index"
                  :true-label="child.trueLabel"
                  :false-label="child.falseLabel"
                  :border="child.border"
                  :name="child.name"
                  :checked="child.checked"
                  :indeterminate="child.indeterminate"
                  :disabled="child.disabled"
                  >{{ child.label }}</el-checkbox
                >
              </el-checkbox-group>
              <!-- 基础用法 -->
              <el-checkbox
                v-else
                v-model="ruleForm[item.prop]"
                :label="item.checkLabel || ''"
                :true-label="item.trueLabel"
                :false-label="item.falseLabel"
                :border="item.border"
                :name="item.name"
                :checked="item.checked"
                :indeterminate="item.indeterminate"
                :disabled="item.disabled || disabledProp[item.prop] || false"
                @change="(item.change && item.change($event)) || checkboxChange(ruleForm[item.prop], item.prop)"
              ></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="item.span || span" v-if="item.type === 'radio'">
            <el-form-item :label="item.label" :prop="item.prop">
              <el-radio-group
                :disabled="item.disabled || disabledProp[item.prop]"
                :text-color="item.textColor"
                :fill="item.fill"
                @change="(item.change && item.change($event)) || radioChange(ruleForm[item.prop], item.prop)"
                v-model="ruleForm[item.prop]"
              >
                <el-radio
                  v-for="(child, index) in item.option || item.options || item.optionData || optionData[item.prop] || []"
                  :key="index"
                  :label="child.value"
                  :disabled="child.disabled"
                  :border="child.border"
                  :name="child.name"
                  >{{ child.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="item.span || span" v-if="item.type === 'upload'">
            <el-form-item :label="item.label" :prop="item.prop">
              <el-upload
                ref="upload"
                :action="item.action"
                :headers="item.headers"
                :multiple="item.multiple"
                :data="item.data"
                :name="item.name"
                :with-credentials="item.withCredentials"
                :show-file-list="item.showFileList"
                :drag="item.drag"
                :accept="item.accept"
                :on-preview="item.onPreview"
                :on-remove="item.onRemove"
                :on-success="item.onSuccess"
                :on-error="item.onError"
                :on-change="item.onChange"
                :before-upload="item.beforeUpload"
                :before-remove="item.beforeRemove"
                :list-type="item.listType"
                :auto-upload="item.autoUpload"
                :http-request="item.httpRequest"
                :disabled="item.disabled"
                :limit="item.limit"
                :on-exceed="item.onExceed"
                :file-list="ruleForm[item.prop]"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">
                  {{ item.tip }}
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
          <!-- 开关 -->
          <el-col :span="item.span || span" v-if="item.type === 'switch'">
            <el-form-item :label="item.label" :prop="item.prop">
              <el-switch
                v-model="ruleForm[item.prop]"
                :active-color="item.activeColor"
                :inactive-color="item.inactiveColor"
                :disabled="item.disabled || disabledProp[item.prop]"
                :width="item.width"
                :active-icon-class="item.activeIconClass"
                :inactive-icon-class="item.inactiveIconClass"
                :active-text="item.activeText"
                :inactive-text="item.inactiveText"
                :active-value="item.activeValue"
                :inactive-value="item.inactiveValue"
                :name="item.name"
                :validate-event="item.validateEvent"
                @change="item.change && item.change($event)"
                @focus="item.focus && item.focus($event)"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <!-- Cascader 级联选择器 -->
          <el-col :span="item.span || span" v-if="item.type === 'cascader'">
            <el-form-item :label="item.label" :prop="item.prop">
              <el-cascader
                v-model="ruleForm[item.prop]"
                :options="item.option || item.options || item.optionData || optionData[item.prop] || []"
                :props="item.props"
                :size="item.size"
                :placeholder="item.placeholder"
                :disabled="item.disabled || disabledProp[item.prop]"
                :clearable="item.clearable"
                :show-all-levels="item.showAllLevels"
                :collapse-tags="item.collapseTags"
                :separator="item.separator"
                :filterable="item.filterable"
                :filter-method="item.filterMethod"
                :debounce="item.debounce"
                :before-filter="item.beforeFilter"
                :popper-class="item.popperClass"
                @change="item.change && item.change($event)"
                @expand-change="item.expandChange && item.expandChange($event)"
                @blur="item.blur && item.blur($event)"
                @focus="item.focus && item.focus($event)"
                @visible-change="item.visibleChange && item.visibleChange($event)"
                @remove-tag="item.removeTag && item.removeTag($event)"
              >
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="item.span || span" v-if="dateTimePickerType.includes(item.type)">
            <el-form-item :label="item.label" :prop="item.prop">
              <el-date-picker
                :clearable="clearableHandle(item.clearable)"
                :time-arrow-control="item.timeArrowControl"
                :format="item.format"
                :align="item.align"
                :picker-options="item.pickerOptions"
                :range-separator="item.rangeSeparator || config.to"
                :default-time="item.defaultTime"
                :default-value="item.defaultValue"
                :value-format="item.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
                :name="item.name"
                :unlink-panels="item.unlinkPanels"
                :prefix-icon="item.prefixIcon"
                :clear-icon="item.clearIcon"
                :disabled="item.disabled || disabledProp[item.prop] || false"
                v-model="ruleForm[item.prop]"
                :type="item.type"
                @change="item.change && item.change($event)"
                @blur="item.blur && item.blur($event)"
                @focus="item.focus && item.focus($event)"
                :start-placeholder="config.startTime"
                :end-placeholder="config.endTime"
                :placeholder="config.selTime"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="item.span || span" v-if="item.type === 'timePicker'">
            <el-form-item :label="item.label" :prop="item.prop">
              <el-time-picker
                :readonly="item.readonly"
                :disabled="item.disabled"
                :clearable="clearableHandle(item.clearable)"
                :align="item.align"
                :is-range="item.isFange"
                :arrow-control="item.arrowControl"
                v-model="ruleForm[item.prop]"
                :value-format="item.valueFormat"
                :default-value="item.defaultValue"
                :name="item.name"
                :prefix-icon="item.prefixIcon"
                :clear-icon="clearIcon"
                :range-separator="item.rangeSeparator || config.to"
                :start-placeholder="item.startPlaceholder || config.startTime"
                :end-placeholder="item.endPlaceholder || config.endTime"
                :placeholder="item.placeholder || config.selTime"
                :picker-options="item.pickerOptions"
                @change="item.change && item.change($event)"
                @blur="item.blur && item.blur($event)"
                @focus="item.focus && item.focus($event)"
              >
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="item.span || span" v-if="(item.type === 'select' || item.type === 'option') && !hideProp[item.prop]">
            <el-form-item :label="item.label" :prop="item.reset || item.prop">
              <el-select
                v-model="ruleForm[item.prop]"
                default-first-option
                :clearable="clearableHandle(item.clearable)"
                :disabled="item.disabled || disabledProp[item.prop]"
                :remote="item.remote"
                :allow-create="item.allowCreate"
                :multiple="item.multiple"
                :filterable="item.filterable"
                :loading="loadingProp[item.prop || item.field]"
                :collapse-tags="item.collapseTags"
                :value-key="item.valueKey"
                :multiple-limit="item.multipleLimit"
                :name="item.name"
                :autocomplete="item.autocomplete"
                :filter-method="item.filterMethod"
                :loading-text="item.loadingText || loadingText[item.prop]"
                :no-match-text="item.noMatchText"
                :no-data-text="item.noDataText"
                :popper-class="item.popperClass"
                :reserve-keyword="item.reserveKeyword"
                :popper-append-to-body="item.popperAppendToBody"
                :automatic-dropdown="item.automaticDropdown"
                @visible-change="item.visibleChange && item.visibleChange($event)"
                @remove-tag="item.removeTag && item.removeTag($event)"
                @clear="item.clear && item.clear($event)"
                @blur="item.blur && item.blur($event)"
                @focus="item.focus && item.focus($event)"
                @change="(item.change && item.change($event)) || selectChange(item, ruleForm[item.prop])"
                :remote-method="
                  item.remoteMethod ||
                  ((query) => {
                    remoteMethod(query, item.prop);
                  })
                "
                :placeholder="item.placeholder || config.input"
              >
                <!-- 添加一个全选的复选框 -->
                <el-checkbox
                  v-if="item.optionPanelCustom && item.optionPanelCustom.type === 'checkbox'"
                  v-model="optionCheckAllModel"
                  style="margin-left: 20px; margin-bottom: 10px"
                  @change="item.optionPanelCustom.change && item.optionPanelCustom.change(optionCheckAllModel)"
                  >{{ item.optionPanelCustom.label || "全选" }}
                </el-checkbox>
                <!-- :label="item.optionProps && oItem[item.optionProps.label]) || oItem.label" -->
                <el-option
                  v-for="(oItem, okey) in item.option || item.options || item.optionData || optionData[item.prop] || []"
                  :key="okey"
                  :label="formatOptionLabel(oItem, item)"
                  :value="(item.optionProps && oItem[item.optionProps.value]) || oItem.value"
                >
                </el-option>
              </el-select>
              <el-button type="text" v-if="item.tooltip" :icon="item.tooltipIcon" :style="item.tooltipStyle">{{ item.tooltip }}</el-button>
            </el-form-item>
          </el-col>
        </span>
        <!-- 搜索按钮 可以设置 :searchBox="{span:6,style:{'text-align':'right'}}" 为了实现搜素按钮在这一行的最右侧-->
        <el-col
          v-if="searchBox"
          class="search-box"
          :span="packUp ? collapseBox.searchBoxSpan : searchBox && searchBox.span"
          :style="(searchBox && searchBox.style) || 'text-align:left'"
        >
          <el-form-item>
            <el-button @click="submitForm('ruleForm')" icon="el-icon-search" type="primary">{{ "搜索" }}</el-button>
            <el-button v-if="(searchBox && searchBox.reset) || true" icon="el-icon-refresh-left" @click="resetForm('ruleForm')">{{
              "重置"
            }}</el-button>
            <el-button type="text" v-if="collapseBox" @click="toggleAdvanced"
              >{{ packUp ? "展开" : "收起" }}<i :class="packUp ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i
            ></el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 操作 兼容之前的版本 可以设置两个按钮 或者插槽 慢慢地被弃用-->
      <span v-if="operation" class="operation" :style="operationStyle">
        <slot :data="ruleForm" name="operation"></slot>
        <el-button v-if="operation.reset" @click="resetForm('ruleForm')">{{ operation.reset }}</el-button>
        <el-button v-if="operation.save" type="primary" @click="submitForm('ruleForm')">{{ operation.save }}</el-button>
      </span>
    </el-form>
  </div>
</template>

<script>
import DonMessage from "common/js/message";
export default {
  name: "secForm",
  components: {},
  props: {
    span: Number, //所有的表单占用的空间 优先级低于默认低于在内部的span
    labelWidth: String,
    labelPosition: String,
    //是搜素区使用
    /**
     * @param {number} :span 占位符
     * @param:{object} :style 样式配置
     */
    searchBox: {
      type: Object,
      default: () => {
        return null;
      },
    },
    //展示收缩面板
    /**
     * @param {number} :endIndex 从0到endIndex截取数据
     * @param:{number} :searchBoxSpan 搜素和重置占位符
     */
    collapseBox: {
      type: Object,
      default: () => {
        return null;
      },
    },
    gutter: Number, //表单的间距
    rules: Object,
    ruleForm: Object,
    formValidateData: Array, //动态生成form表单的数据格式
    formData: Array, //同formValidateData意思一样 只是为了想字段短一些，然后兼容之前的版本用的
    disabledProp: {
      //让哪个form表单disabled 例如  disabledProp:{name:true} 让字段为name的表单失效
      type: Object,
      default: () => {
        return {};
      },
    },
    hideProp: {
      type: Object,
      default: () => {
        return {};
      },
    },
    loadingProp: {
      type: Object,
      default: () => {
        return {};
      },
    },
    loadingText: {
      type: Object,
      default: () => {
        return {};
      },
    },
    //type:select option数据 {"字段名":数据}
    optionData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    operation: {
      type: Object,
      default: () => {
        return null;
      },
    },
    operationStyle: {
      type: Object,
      default: () => {
        return { "text-align": "center", display: "block" };
      },
    },
  },
  data() {
    return {
      optionCheckAllModel: false, //下拉框组件 自定义面板 添加一个全选复选框
      packUp: false, //收起 展开切换
      deepRuleForm: {},
      temRuleForm: {},
      collapseData: null, //收起，展开数据
      buttonType: ["保存", "提交", "搜索", "上传", "确定"],
      inputType: ["text", "textarea"], //input 输入框组件 类型
      dateTimePickerType: [
        "year",
        "month",
        "date",
        "dates",
        "week",
        "datetime",
        "datetimerange",
        "daterange",
        "monthrangenge",
        "daterange",
        "datetimera",
      ], //日期时间选择器和日期选择器组件的type
    };
  },
  mounted() {
    this.packUp = this.collapseBox ? true : false;
  },
  methods: {
    formatOptionLabel(oItem, item) {
      if (item?.optionProps && typeof item.optionProps.label === "function") {
        return item.optionProps.label(oItem);
      }
      if (item.optionProps && item.optionProps.labelJoin) {
        return `${oItem[item.optionProps.label]} -- ${oItem[item.optionProps.labelJoin]}`;
      } else if (item.optionProps) {
        let { label } = item.optionProps;
        if (Array.isArray(label)) {
          return `${oItem[label[0]]} -- ${oItem[label[1]]}`;
        }
        return oItem[item.optionProps.label];
      } else {
        return oItem.label;
      }
    },
    clearableHandle(clearable) {
      return typeof clearable === "boolean" && clearable === false ? false : true;
    },
    //展开收缩逻辑
    toggleAdvanced() {
      this.packUp = !this.packUp;
      if (this.packUp) {
        //收缩
        this.deepRuleForm = JSON.parse(JSON.stringify(this.ruleForm));
        // this.resetForm()
        this.formData && (this.collapseData = this.formData.slice(0, this.collapseBox.endIndex));
        this.formValidateData && (this.collapseData = this.formValidateData.slice(0, this.collapseBox.endIndex));
      } else {
        //展开
        this.collapseData = this.formData || this.formValidateData;
        this.$nextTick(() => {
          this.$emit("update:ruleForm", JSON.parse(JSON.stringify(this.deepRuleForm)));
        });
      }
    },
    /**
     * @函数功能:点击搜素按钮 或者你自己定义定义的按钮需要校验的按钮都可以走这里
     * @参数输入:
     * @函数返回:
     */
    submitForm(formName) {
      let sign = true;
      this.$refs[formName || "ruleForm"].validate((valid) => {
        if (valid) {
          sign = true;
          this.$emit("submitForm", this.ruleForm, formName);
        } else {
          sign = false;
          new DonMessage().error({
            message: `有必填项未填写`,
          });
        }
      });
      return sign;
    },
    clearValidate(formName) {
      this.$refs[formName || "ruleForm"].clearValidate();
      this.$emit("clear", this.ruleForm);
    },
    clearForm(formName) {
      this.$refs[formName || "ruleForm"].clearValidate();
      this.$emit("clear", this.ruleForm);
    },
    /**
     * @函数功能:点击重置按钮
     * @参数输入:formName：ref
     * @函数返回:
     */
    resetForm(formName) {
      this.$refs[formName || "ruleForm"].resetFields();
      this.$emit("reset", this.ruleForm);
    },
    resetFields(formName) {
      this.$refs[formName || "ruleForm"].resetFields();
      this.$emit("reset", this.ruleForm);
    },
    remoteMethod(query, prop) {
      this.$emit("remoteMethod", query, prop);
    },
    checkboxChange(model, prop) {
      this.$emit("checkboxChange", model, prop);
    },
    radioChange(model, prop) {
      this.$emit("radioChange", model, prop);
    },
    fileUploadSuceess(response, file, fileList) {
      console.log(response);
      console.log(file);
      console.log(fileList);
      this.$emit("fileUploadSuceess", { response, file, fileList });
    },
    /**
     * @函数功能:selectChange的会触发这个
     * @参数输入:
     * @函数返回:
     */
    selectChange(item, value) {
      this.$emit("selectChange", { item, value });
    },
    inputChange(item, value) {
      this.$emit("inputChange", { item, value });
    },
    textareaBlur(data) {
      if (data.dataFormat && data.dataFormat === "json") {
        this.$emit("textareaJson", data);
      }
      if (data.blur) {
        data["value"] = this.ruleForm[data.prop];
        this.$emit("textareaBlur", data);
      }
    },
  },
  computed: {
    labelPositionTopClass() {
      return this.labelPosition == "top";
    },
  },
  watch: {
    formValidateData: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (this.collapseBox && newVal) {
          this.collapseData = newVal.slice(0, this.collapseBox.endIndex);
        }
      },
    },
    formData: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (this.collapseBox && newVal) {
          this.collapseData = newVal.slice(0, this.collapseBox.endIndex);
        }
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.label-top-sty {
  margin-bottom: 15px;
  ::v-deep .el-form-item__label {
    padding: 0;
  }
  ::v-deep .el-form-item {
    margin-bottom: 5px;
  }
  .search-box {
    margin-top: 31px;
  }
}
::v-deep .el-select,
.el-date-editor {
  width: 100%;
}
::v-deep .el-input-group__prepend .el-select {
  width: 100px;
}
.base-info-ruleForm {
  // margin-top:20px;
  margin-left: 20px;
  margin-right: 20px;
}
.monaco-box {
  border: 1px solid #ccc;
}
.operation-btn ::v-deep .el-form-item__content {
  margin-left: 0 !important;
}
.search-box ::v-deep .el-form-item__content {
  margin-left: 0 !important;
}
</style>
