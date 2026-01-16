import { SafeAny } from "@/types";
import { message } from "antd";
import DOMPurify from "dompurify";

const sanitizeOptions = {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'br', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li', 'a', 'img', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'code', 'blockquote', 'video', 'source', 'pre', 'div', 'span'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'colspan', 'rowspan', 'style', 'width', 'height', 'class', 'controls', 'autoplay', 'loop', 'muted', 'poster'],
    // 为外部链接添加安全属性
    ADD_ATTR: ['target'],
    ADD_URI_SAFE_ATTR: ['href'],
};


// 环境判断工具函数（保留，用于区分 SSR/CSR）
export const isClient = () => typeof window !== "undefined";
export const isServer = () => !isClient();

export const phoneRule = /^(\+86|86)?1[3-9]\d{9}$|^(\+886|0)9\d{8}$/
export const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Utils = {
    common: {
        //防抖 多次点击执行最后一次
        debouncing: function <T extends Array<any>, R>(func: (...args: T) => R, delay: number): (...args: T) => void {
            let timer: any = null;
            return (...args: T) => {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    func.apply(this, args)
                }, delay)
            }
        },
        //节流 多次点击，隔一段时间才能执行一次 
        throttle: function <T extends Array<any>, R>(func: (...args: T) => R, delay: number): (...args: T) => void {
            let timer: any = null;
            return (...args: T) => {
                if (!timer) {
                    func.apply(this, args);
                    timer = setTimeout(() => {
                        clearTimeout(timer)
                        timer = null;
                    }, delay);
                }
            };
        }
    },
    str: {
        // 验证密码是否符合要求（包含字母、数字和特殊字符，长度在6到18之间）
        isValidPassword: (password: string) => {
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumber = /\d/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            const typesCount = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;
            return typesCount >= 2 && password.length >= 6 && password.length <= 18;
        },
        replaceVariables(
            template: string,
            variables: Record<string, string>
        ): string {
            // 使用正则表达式匹配花括号内的变量名
            return template.replace(/\{(\w+)\}/g, (match, variableName) => {
                // 根据变量名从对象中取值，如果没有匹配的值，则返回原始变量
                return variables[variableName] !== undefined
                    ? variables[variableName]
                    : match;
            });
        },
        jsonParse: function <T>(str: SafeAny): T | false {
            try {
                return JSON.parse(str as string) as T
            } catch (error) {
                return false
            }
        },
        hidePhoneNumber: (phone: string) => {
            // 检查输入的手机号是否为有效的11位数字
            if (Utils.str.isChinaMobile(phone)) {
                return phone.substring(0, phone.length - 8) + '****' + phone.substring(phone.length - 4);
            } else {
                return "Invalid phone number";
            }
        },
        rn2br: (str: string): string => {
            return str.replace(/(\r\n)|(\n)/g, '<br>');
        },
        isNull: (s: any): boolean => {
            return (s === null || typeof s === 'undefined');
        },
        isEmpty: (s: any): boolean => {
            if (Utils.str.isNull(s)) {
                return true;
            }
            if (typeof s != 'string') {
                return false;
            }
            return s.length === 0;
        },
        isNotEmpty: (s: string | null | undefined): boolean => {
            return !Utils.str.isEmpty(s);
        },
        trim: (x: string): string => {
            return x.replace(/^\s+|\s+$/gm, '');
        },
        isChinaMobile: (mobile: string = ''): boolean => {
            return phoneRule.test(mobile)
        },
        isValidEmail: (email: string): boolean => {
            return emailRule.test(email);
        },
        passwordLengthValid: (password: string = ""): boolean => {
            return password.length <= 18 && password.length >= 6;
        },
        randomString: (len: number) => {
            let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let maxIndex = chars.length;
            let s = '';
            for (let i = 0; i < len; i++) {
                s += chars.charAt(Math.floor(Math.random() * maxIndex));
            }
            return s;
        },
        copy: async (text: string) => {
            const iosAgent = () => {
                return navigator.userAgent.match(/(iPhone|iPod|iPad);?/i);
            }
            function _execCommand(action: string) {
                let is = document.execCommand(action);
                if (is) {
                    message.success('复制成功');
                } else {
                    message.warning('复制失败，请手动复制');
                }
            }
            // 复制文本函数，微信端，需要在用户触发 Click 事件里面才能执行成功
            const copy = (message: string) => {
                if (iosAgent()) {
                    let inputObj = document.createElement("input");
                    inputObj.value = message;
                    document.body.appendChild(inputObj);
                    inputObj.select();
                    inputObj.setSelectionRange(0, inputObj.value.length);
                    _execCommand('Copy');
                    document.body.removeChild(inputObj);
                } else {
                    let domObj = document.createElement("span");
                    domObj.innerHTML = message;
                    document.body.appendChild(domObj);
                    let selection = window.getSelection();
                    let range = document.createRange();
                    range.selectNodeContents(domObj);
                    selection?.removeAllRanges();
                    selection?.addRange(range);
                    _execCommand('Copy');
                    document.body.removeChild(domObj);
                }
            }
            return copy(text);
        },
        queryHighlight: (richText: string, queryText?: string) => {
            if (queryText) {
                const regex = new RegExp(`(${queryText || ''})`, 'gi');
                return richText.replace(regex, '<span style="color: red; font-weight: bolder ">$1</span>');
            }
            return richText;
        }
    },

    date: {
        getTimeAgo: (time: Date | number) => {
            const now = new Date();
            const _time = typeof time === 'number' ? time : time.getTime()
            const duration = now.getTime() - _time
            let day: number = parseInt((duration / (24 * 3600 * 1000)).toString())
            let hour = parseInt(((duration % (24 * 3600 * 1000)) / 3600000).toString());
            let minute = parseInt(((duration % 3600000) / 60000).toString());
            let second = parseInt(((duration % 60000) / 1000).toString());

            if (day > 0) {
                return day + '天前';
            } if (hour > 0) {
                return hour + '小时前'
            } if (minute > 0) {
                return minute + '分钟前'
            }
            return second + '秒种前'
        },
        remainingTime: (remainTime: number) => {
            let day = parseInt((remainTime / (24 * 3600 * 1000)).toString())

            let hour = parseInt(((remainTime % (24 * 3600 * 1000)) / 3600000).toString());

            let minute = parseInt(((remainTime % 3600000) / 60000).toString());

            let second = parseInt(((remainTime % 60000) / 1000).toString());

            let res = '';
            if (day > 0) {
                res = day + '天';
            } if (hour > 0) {
                res = res + (hour + '小时')
            } if (minute > 0) {
                res = res + (minute + '分')
            }
            res = res + (second + '秒')
            return res;
        },
        format: (date: Date | number, fmt?: string): (string | null) => {
            if (!date) {
                return null;
            }
            if (typeof date === 'number') {
                date = new Date(date)
            }
            fmt = fmt ?? 'yyyy/MM/dd HH:mm:ss'
            var o: any = {
                'M+': date.getMonth() + 1, // 月份
                'd+': date.getDate(), // 日
                'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
                'H+': date.getHours(), // 小时
                'm+': date.getMinutes(), // 分
                's+': date.getSeconds(), // 秒
                'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
                'S': date.getMilliseconds(),
            };
            var week: any = {
                '0': '\u65e5',
                '1': '\u4e00',
                '2': '\u4e8c',
                '3': '\u4e09',
                '4': '\u56db',
                '5': '\u4e94',
                '6': '\u516d',
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '')
                    .substr(4 - RegExp.$1.length));
            }
            if (/(E+)/.test(fmt)) {
                fmt = fmt
                    .replace(
                        RegExp.$1,
                        ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f'
                            : '\u5468')
                            : '')
                        + week[date.getDay() + '']);
            }
            for (var k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    fmt = fmt.replace(RegExp.$1,
                        (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k])
                            .substr(('' + o[k]).length)));
                }
            }
            return fmt;
        },
        formatSeconds: (seconds: number) => {
            const hours = Math.floor(seconds / 3600);  // 计算小时数
            const minutes = Math.floor((seconds % 3600) / 60);  // 计算分钟数
            const remainingSeconds = seconds % 60;  // 剩余的秒数

            // 将小时、分钟和秒转换为两位数格式
            const paddedHours = String(hours).padStart(2, '0');
            const paddedMinutes = String(minutes).padStart(2, '0');
            const paddedSeconds = String(remainingSeconds).padStart(2, '0');

            return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
        }
    },
    file: {
        formatFileSize(bytes: number) {
            const SIZE_KB = 1024;
            const SIZE_MB = 1024 * SIZE_KB;

            if (bytes >= SIZE_MB) {
                return (bytes / SIZE_MB).toFixed(2) + 'M'; // 转换为MB，保留两位小数
            } else {
                return Math.ceil(bytes / SIZE_KB) + 'K'; // 转换为KB，并向上取整至最近的整数
            }
        },
    },
    link: {
        dowloadFile: (url: string, title: string) => {
            // axios.get(url, { responseType: 'blob' }).then(res => {
            //     const blob = new Blob([res.data])
            //     let a = document.createElement('a')
            //     a.href = URL.createObjectURL(blob)
            //     a.download = title
            //     a.click()
            // })
        }
    },
    richText: {
        extractTextFromHtml: (html: string) => {
            // console.log('html', html)
            // console.log('DOMPurify', DOMPurify.sanitize) 
            // return DOMPurify.sanitize(html, sanitizeOptions);
            if (DOMPurify && DOMPurify.sanitize) {
                return DOMPurify.sanitize(html, sanitizeOptions);
            }
            return html
        }
    },
    img: {
        onDownload: (src: string, name?: string) => {
            fetch(src)
                .then((response) => response.blob())
                .then((blob) => {
                    const url = URL.createObjectURL(new Blob([blob]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `${name || "image"}.png`;
                    document.body.appendChild(link);
                    link.click();
                    URL.revokeObjectURL(url);
                    link.remove();
                });
        }
    },
};


export { Utils };