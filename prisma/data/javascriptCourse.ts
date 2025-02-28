import { CourseType } from "@prisma/client";
import { Course, Lesson, Question } from "../seed";

export const courses: Course[] = [{ id: 1, name: CourseType.JAVA_SCRIPT }];

export const lessons: Lesson[] = [
  {
    id: 1,
    name: "【初級】JavaScript基礎編",
    courseId: 1,
    caution:
      "・必ず 関数の定義 → 定数の定義 → 実行結果の出力 の順に記述\n・アロー関数を使用\n・配列メソッド(map, filter, reduce など)を優先\n・省略記法を活用\n・for文は必要な場合を除き避ける",
  },
  {
    id: 2,
    name: "【中級】JavaScript応用編",
    courseId: 1,
    caution:
      "・必ず 関数の定義 → 定数の定義 → 実行結果の出力 の順に記述\n・アロー関数を使用\n・配列メソッド(map, filter, reduce など)を優先\n・省略記法を活用\n・for文は必要な場合を除き避ける",
  },
  {
    id: 3,
    name: "【上級】JavaScript高度実装編",
    courseId: 1,
    caution:
      "・必ず 関数の定義 → 定数の定義 → 実行結果の出力 の順に記述\n・アロー関数を使用\n・配列メソッド(map, filter, reduce など)を優先\n・省略記法を活用\n・for文は必要な場合を除き避ける",
  },
];

const lesson1Questions: Question[] = [
  {
    id: 1,
    lessonId: 1,
    content:
      "数値を受け取って2倍にして返す関数を作成し、実行結果をconsole.logで表示してください。",
    template:
      "// ① 引数用の定数\nconst num = 2;\n\n// ② 関数定義\n\n// ③ 関数呼び出し",
    title: "数値を2倍にする",
    example: "引数: 2 => 出力: 4",
    exampleAnswer:
      "const doubleNum = n => n * 2;\nconst num = 2;\nconsole.log(doubleNum(num)); // 4",
  },
  {
    id: 2,
    lessonId: 1,
    content:
      "数値を受け取って1からその数値までの合計値を返す関数を作成し、結果を表示してください。",
    template:
      "// ① 引数用の定数\nconst num = 5;\n\n// ② 関数定義\n\n// ③ 関数呼び出し",
    title: "1からnまでの合計",
    example: "引数: 5 => 出力: 15 (1+2+3+4+5)",
    exampleAnswer:
      "const sumUpTo = n => [...Array(n).keys()].map(i=>i+1).reduce((a,b)=>a+b,0);\nconst num = 5;\nconsole.log(sumUpTo(num)); // 15",
  },
  {
    id: 3,
    lessonId: 1,
    content:
      "数値を受け取って偶数か判定する関数を作成し、結果をtrue/falseで返してください。",
    template:
      "// ① 引数用の定数\nconst num = 10;\n\n// ② 関数定義\n\n// ③ 関数呼び出し",
    title: "偶数判定",
    example: "引数: 10 => 出力: true",
    exampleAnswer:
      "const isEven = n => n % 2 === 0;\nconst num = 10;\nconsole.log(isEven(num)); // true",
  },
  {
    id: 4,
    lessonId: 1,
    content:
      "2つの数値を受け取り、大きいほうの値を返す関数を作成してください。",
    template:
      "// ① 定数\nconst a = 3;\nconst b = 7;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "最大値を返す",
    example: "引数: (3, 7) => 出力: 7",
    exampleAnswer:
      "const max = (x,y) => x > y ? x : y;\nconst a = 3;\nconst b = 7;\nconsole.log(max(a,b)); // 7",
  },
  {
    id: 5,
    lessonId: 1,
    content: "2つの数値を受け取り、積(掛け算)を返す関数を作成してください。",
    template:
      "// ① 定数\nconst x = 4;\nconst y = 5;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "掛け算関数",
    example: "引数: (4, 5) => 20",
    exampleAnswer:
      "const multiply = (x,y) => x * y;\nconst x = 4;\nconst y = 5;\nconsole.log(multiply(x,y)); // 20",
  },
  {
    id: 6,
    lessonId: 1,
    content:
      "文字列を受け取り、それを繰り返し回数分結合して返す関数を作成してください。",
    template:
      '// ① 定数\nconst str = "Hello";\nconst repeatCount = 3;\n\n// ② 関数定義\n\n// ③ 実行',
    title: "文字列の繰り返し",
    example: '引数: ("Hello", 3) => "HelloHelloHello"',
    exampleAnswer:
      'const repeatStr = (s,n) => s.repeat(n);\nconst str = "Hello";\nconst repeatCount = 3;\nconsole.log(repeatStr(str, repeatCount)); // HelloHelloHello',
  },
  {
    id: 7,
    lessonId: 1,
    content:
      "数値を受け取って、0以上であれば'positive'、それ以外は'negative'と返す関数を作成してください。",
    template: "// ① 定数\nconst num = -1;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "正負判定",
    example: '引数: -1 => 出力: "negative"',
    exampleAnswer:
      "const checkSign = n => n >= 0 ? 'positive' : 'negative';\nconst num = -1;\nconsole.log(checkSign(num)); // negative",
  },
  {
    id: 8,
    lessonId: 1,
    content: "配列を受け取り、その長さを返す関数を作成してください。",
    template: "// ① 定数\nconst arr = [1,2,3];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "配列の長さ取得",
    example: "引数: [1,2,3] => 出力: 3",
    exampleAnswer:
      "const getLength = array => array.length;\nconst arr = [1,2,3];\nconsole.log(getLength(arr)); // 3",
  },
  {
    id: 9,
    lessonId: 1,
    content:
      "数値を受け取って、奇数なら'odd'、偶数なら'even'を返す関数を作成してください。",
    template: "// ① 定数\nconst num = 5;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "奇数偶数判定",
    example: "引数: 5 => 'odd'",
    exampleAnswer:
      "const oddOrEven = n => n % 2 === 0 ? 'even' : 'odd';\nconst num = 5;\nconsole.log(oddOrEven(num)); // odd",
  },
  {
    id: 10,
    lessonId: 1,
    content: "2つの文字列を受け取り、結合して返す関数を作成してください。",
    template:
      "// ① 定数\nconst str1 = 'Hello';\nconst str2 = 'World';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "文字列結合",
    example: "引数: ('Hello','World') => 'HelloWorld'",
    exampleAnswer:
      "const concatStr = (a,b) => a + b;\nconst str1 = 'Hello';\nconst str2 = 'World';\nconsole.log(concatStr(str1,str2)); // HelloWorld",
  },

  {
    id: 11,
    lessonId: 1,
    content: "配列を受け取り、要素を2倍にして返す関数を作成してください。",
    template: "// ① 定数\nconst arr = [1,2,3];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "配列要素を2倍",
    example: "引数: [1,2,3] => [2,4,6]",
    exampleAnswer:
      "const doubleArr = arr => arr.map(x=> x*2);\nconst arr = [1,2,3];\nconsole.log(doubleArr(arr)); // [2,4,6]",
  },
  {
    id: 12,
    lessonId: 1,
    content:
      "配列を受け取り、偶数だけを抽出した新しい配列を返す関数を作成してください。",
    template:
      "// ① 定数\nconst arr = [1,2,3,4,5];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "配列の偶数フィルタ",
    example: "引数: [1,2,3,4,5] => [2,4]",
    exampleAnswer:
      "const filterEven = arr => arr.filter(x=> x%2===0);\nconst arr = [1,2,3,4,5];\nconsole.log(filterEven(arr)); // [2,4]",
  },
  {
    id: 13,
    lessonId: 1,
    content: "配列を受け取り、全ての要素の合計を返す関数を作成してください。",
    template: "// ① 定数\nconst arr = [1,2,3];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "配列の合計",
    example: "引数: [1,2,3] => 6",
    exampleAnswer:
      "const sumArray = arr => arr.reduce((a,b)=>a+b,0);\nconst arr = [1,2,3];\nconsole.log(sumArray(arr)); // 6",
  },
  {
    id: 14,
    lessonId: 1,
    content:
      "文字列の配列を受け取り、それぞれの文字列の長さを要素とする配列を返してください。",
    template:
      "// ① 定数\nconst arr = ['apple','kiwi','orange'];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "文字列長の配列化",
    example: "引数: ['apple','kiwi','orange'] => [5,4,6]",
    exampleAnswer:
      "const lengthArr = arr => arr.map(s=>s.length);\nconst arr = ['apple','kiwi','orange'];\nconsole.log(lengthArr(arr)); // [5,4,6]",
  },
  {
    id: 15,
    lessonId: 1,
    content: "配列を受け取り、文字列要素のみ抽出した配列を返してください。",
    template:
      "// ① 定数\nconst arr = [1,'apple',true,'banana'];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "文字列要素のフィルタ",
    example: "引数: [1,'apple',true,'banana'] => ['apple','banana']",
    exampleAnswer:
      "const onlyStrings = arr => arr.filter(x=> typeof x === 'string');\nconst arr = [1,'apple',true,'banana'];\nconsole.log(onlyStrings(arr)); // ['apple','banana']",
  },
  {
    id: 16,
    lessonId: 1,
    content:
      "配列を受け取り、要素を逆順に並べ替えた新しい配列を返してください。（元の配列を変化させない）",
    template: "// ① 定数\nconst arr = [1,2,3];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "配列を逆順に",
    example: "引数: [1,2,3] => [3,2,1]",
    exampleAnswer:
      "const reverseArr = arr => [...arr].reverse();\nconst arr = [1,2,3];\nconsole.log(reverseArr(arr)); // [3,2,1]",
  },
  {
    id: 17,
    lessonId: 1,
    content:
      "配列を受け取り、重複した要素を取り除いた新しい配列を返してください。",
    template:
      "// ① 定数\nconst arr = [1,2,2,3,1,4];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "重複の排除",
    example: "引数: [1,2,2,3,1,4] => [1,2,3,4]",
    exampleAnswer:
      "const uniqueArr = arr => [...new Set(arr)];\nconst arr = [1,2,2,3,1,4];\nconsole.log(uniqueArr(arr)); // [1,2,3,4]",
  },
  {
    id: 18,
    lessonId: 1,
    content:
      "配列を受け取り、要素をすべて文字列に変換した配列を返してください。",
    template:
      "// ① 定数\nconst arr = [1,true,null];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "要素の文字列変換",
    example: "引数: [1,true,null] => ['1','true','null']",
    exampleAnswer:
      "const toStringArr = arr => arr.map(x=>String(x));\nconst arr = [1,true,null];\nconsole.log(toStringArr(arr)); // ['1','true','null']",
  },
  {
    id: 19,
    lessonId: 1,
    content:
      "配列を受け取り、全要素をカンマ区切りの文字列に変換して返してください。",
    template:
      "// ① 定数\nconst arr = ['apple','banana','grape'];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "配列を文字列に",
    example: "引数: ['apple','banana','grape'] => 'apple,banana,grape'",
    exampleAnswer:
      "const joinWithComma = arr => arr.join(',');\nconst arr = ['apple','banana','grape'];\nconsole.log(joinWithComma(arr)); // apple,banana,grape",
  },
  {
    id: 20,
    lessonId: 1,
    content:
      "配列を受け取り、要素を昇順にソートした新しい配列を返してください。",
    template: "// ① 定数\nconst arr = [3,1,2];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "配列のソート",
    example: "引数: [3,1,2] => [1,2,3]",
    exampleAnswer:
      "const sortAsc = arr => [...arr].sort((a,b)=>a-b);\nconst arr = [3,1,2];\nconsole.log(sortAsc(arr)); // [1,2,3]",
  },

  {
    id: 21,
    lessonId: 1,
    content: "文字列を受け取り、先頭の文字を大文字に変換して返してください。",
    template: "// ① 定数\nconst str = 'hello';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "先頭文字を大文字",
    example: "引数: 'hello' => 'Hello'",
    exampleAnswer:
      "const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);\nconst str = 'hello';\nconsole.log(capitalize(str)); // Hello",
  },
  {
    id: 22,
    lessonId: 1,
    content: "文字列を受け取り、逆順にした文字列を返してください。",
    template: "// ① 定数\nconst str = 'abc';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "文字列の反転",
    example: "引数: 'abc' => 'cba'",
    exampleAnswer:
      "const reverseStr = s => s.split('').reverse().join('');\nconst str = 'abc';\nconsole.log(reverseStr(str)); // cba",
  },
  {
    id: 23,
    lessonId: 1,
    content: "文字列を受け取り、全ての文字を小文字に変換して返してください。",
    template: "// ① 定数\nconst str = 'HeLLo';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "小文字変換",
    example: "引数: 'HeLLo' => 'hello'",
    exampleAnswer:
      "const toLower = s => s.toLowerCase();\nconst str = 'HeLLo';\nconsole.log(toLower(str)); // hello",
  },
  {
    id: 24,
    lessonId: 1,
    content:
      "文字列を受け取り、単語ごとに分割して配列で返してください。（スペース区切り）",
    template:
      "// ① 定数\nconst str = 'Hello World JS';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "スペースで分割",
    example: "引数: 'Hello World JS' => ['Hello','World','JS']",
    exampleAnswer:
      "const splitBySpace = s => s.split(' ');\nconst str = 'Hello World JS';\nconsole.log(splitBySpace(str)); // ['Hello','World','JS']",
  },
  {
    id: 25,
    lessonId: 1,
    content:
      "文字列を受け取り、特定の文字が含まれるかを返してください。（true / false）",
    template:
      "// ① 定数\nconst str = 'apple';\nconst search = 'p';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "文字の含有確認",
    example: "引数: ('apple','p') => true",
    exampleAnswer:
      "const includesChar = (s,ch) => s.includes(ch);\nconst str = 'apple';\nconst search = 'p';\nconsole.log(includesChar(str,search)); // true",
  },
  {
    id: 26,
    lessonId: 1,
    content: "文字列を受け取り、末尾に『!!!』を付与して返してください。",
    template: "// ① 定数\nconst str = 'Hello';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "文字列の末尾加工",
    example: "引数: 'Hello' => 'Hello!!!'",
    exampleAnswer:
      "const addExcl = s => s + '!!!';\nconst str = 'Hello';\nconsole.log(addExcl(str)); // Hello!!!",
  },
  {
    id: 27,
    lessonId: 1,
    content:
      "文字列を受け取り、すべての単語を大文字に変換して返してください。（スペース区切り）",
    template:
      "// ① 定数\nconst str = 'hello world';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "単語を大文字変換",
    example: "引数: 'hello world' => 'HELLO WORLD'",
    exampleAnswer:
      "const toUpperWords = s => s.split(' ').map(word=>word.toUpperCase()).join(' ');\nconst str = 'hello world';\nconsole.log(toUpperWords(str)); // HELLO WORLD",
  },
  {
    id: 28,
    lessonId: 1,
    content:
      "文字列を受け取り、特定の文字列を他の文字列に置換して返してください。",
    template:
      "// ① 定数\nconst str = 'I like apples';\nconst target = 'apples';\nconst replacement = 'bananas';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "文字列置換",
    example: "引数: 'I like apples' => 'I like bananas'",
    exampleAnswer:
      "const replaceWord = (s,t,r) => s.replace(t,r);\nconst str = 'I like apples';\nconsole.log(replaceWord(str,'apples','bananas')); // I like bananas",
  },
  {
    id: 29,
    lessonId: 1,
    content:
      "文字列を受け取り、最初に見つかった数字(0-9)の位置(index)を返してください。存在しなければ-1。",
    template: "// ① 定数\nconst str = 'abc123';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "数字の検索",
    example: "引数: 'abc123' => 3",
    exampleAnswer:
      "const findDigitIndex = s => {\n  const arr = s.split('');\n  return arr.findIndex(ch => /\\d/.test(ch));\n};\nconst str = 'abc123';\nconsole.log(findDigitIndex(str)); // 3",
  },
  {
    id: 30,
    lessonId: 1,
    content:
      "文字列と数字(n)を受け取り、文字列がn文字以上ならtrueを、そうでなければfalseを返してください。",
    template:
      "// ① 定数\nconst str = 'hello';\nconst n = 5;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "文字列長の比較",
    example: "引数: ('hello',5) => true",
    exampleAnswer:
      "const isLongEnough = (s,n) => s.length >= n;\nconst str = 'hello';\nconst n = 5;\nconsole.log(isLongEnough(str,n)); // true",
  },

  {
    id: 31,
    lessonId: 1,
    content:
      "オブジェクトを受け取り、各プロパティの値を配列として返してください。",
    template:
      "// ① 定数\nconst obj = {a:1,b:2,c:3};\n\n// ② 関数定義\n\n// ③ 実行",
    title: "オブジェクト値の配列化",
    example: "引数: {a:1,b:2,c:3} => [1,2,3]",
    exampleAnswer:
      "const objValues = o => Object.values(o);\nconst obj = {a:1,b:2,c:3};\nconsole.log(objValues(obj)); // [1,2,3]",
  },
  {
    id: 32,
    lessonId: 1,
    content:
      "オブジェクトを受け取り、特定のキーが存在するかを返してください。（true/false）",
    template:
      "// ① 定数\nconst obj = {name:'Taro', age:20};\nconst key = 'age';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "キーの存在確認",
    example: "引数: ({name:'Taro', age:20}, 'age') => true",
    exampleAnswer:
      "const hasKey = (o,k) => o.hasOwnProperty(k);\nconst obj = {name:'Taro', age:20};\nconst key = 'age';\nconsole.log(hasKey(obj,key)); // true",
  },
  {
    id: 33,
    lessonId: 1,
    content:
      "オブジェクトを受け取り、すべての値が文字列型か判定して返してください。",
    template:
      "// ① 定数\nconst obj = {a:'foo', b:'bar', c:10};\n\n// ② 関数定義\n\n// ③ 実行",
    title: "値の文字列チェック",
    example: "引数: {a:'foo', b:'bar', c:10} => false",
    exampleAnswer:
      "const allString = o => Object.values(o).every(v=>typeof v==='string');\nconst obj = {a:'foo', b:'bar', c:10};\nconsole.log(allString(obj)); // false",
  },
  {
    id: 34,
    lessonId: 1,
    content:
      "オブジェクトを受け取り、キーと値のペアを配列の配列（[[key, value], ...]）として返してください。",
    template:
      "// ① 定数\nconst obj = {x:10,y:20};\n\n// ② 関数定義\n\n// ③ 実行",
    title: "エントリの配列化",
    example: "引数: {x:10,y:20} => [['x',10], ['y',20]]",
    exampleAnswer:
      "const objEntries = o => Object.entries(o);\nconst obj = {x:10,y:20};\nconsole.log(objEntries(obj)); // [['x',10], ['y',20]]",
  },
  {
    id: 35,
    lessonId: 1,
    content:
      "オブジェクトを受け取り、値だけが入った配列を昇順にソートして返してください。",
    template:
      "// ① 定数\nconst obj = {a:3,b:1,c:2};\n\n// ② 関数定義\n\n// ③ 実行",
    title: "値のソート",
    example: "引数: {a:3,b:1,c:2} => [1,2,3]",
    exampleAnswer:
      "const sortValues = o => Object.values(o).sort((a,b)=>a-b);\nconst obj = {a:3,b:1,c:2};\nconsole.log(sortValues(obj)); // [1,2,3]",
  },
  {
    id: 36,
    lessonId: 1,
    content:
      "オブジェクトを受け取り、値が数値であるプロパティだけを抽出した新しいオブジェクトを返してください。",
    template:
      "// ① 定数\nconst obj = {a:1,b:'x',c:2};\n\n// ② 関数定義\n\n// ③ 実行",
    title: "数値プロパティの抽出",
    example: "引数: {a:1,b:'x',c:2} => {a:1,c:2}",
    exampleAnswer:
      "const extractNumberProps = o => {\n  const entries = Object.entries(o).filter(([k,v])=>typeof v==='number');\n  return Object.fromEntries(entries);\n};\nconst obj = {a:1,b:'x',c:2};\nconsole.log(extractNumberProps(obj)); // {a:1,c:2}",
  },
  {
    id: 37,
    lessonId: 1,
    content:
      "オブジェクトとキー名を受け取り、そのキーの値を文字列型に変換して返してください。",
    template:
      "// ① 定数\nconst obj = {x:100};\nconst key = 'x';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "指定キーの文字列変換",
    example: "引数: ({x:100}, 'x') => '100'",
    exampleAnswer:
      "const keyToString = (o,k) => String(o[k]);\nconst obj = {x:100};\nconst key = 'x';\nconsole.log(keyToString(obj,key)); // '100'",
  },
  {
    id: 38,
    lessonId: 1,
    content:
      "ユーザー情報オブジェクト {name, age} を受け取り、『名前: ○○, 年齢: ○○歳』 の文字列を返してください。",
    template:
      "// ① 定数\nconst user = {name:'Taro', age:20};\n\n// ② 関数定義\n\n// ③ 実行",
    title: "ユーザー情報のフォーマット",
    example: "引数: {name:'Taro', age:20} => '名前: Taro, 年齢: 20歳'",
    exampleAnswer:
      "const formatUser = u => `名前: ${u.name}, 年齢: ${u.age}歳`;\nconst user = {name:'Taro', age:20};\nconsole.log(formatUser(user)); // '名前: Taro, 年齢: 20歳'",
  },
  {
    id: 39,
    lessonId: 1,
    content:
      "2つのオブジェクトを受け取り、それらをマージ（結合）した新しいオブジェクトを返してください。",
    template:
      "// ① 定数\nconst obj1 = {a:1};\nconst obj2 = {b:2};\n\n// ② 関数定義\n\n// ③ 実行",
    title: "オブジェクトのマージ",
    example: "引数: ({a:1}, {b:2}) => {a:1,b:2}",
    exampleAnswer:
      "const mergeObj = (o1,o2) => ({...o1, ...o2});\nconst obj1 = {a:1};\nconst obj2 = {b:2};\nconsole.log(mergeObj(obj1,obj2)); // {a:1,b:2}",
  },
  {
    id: 40,
    lessonId: 1,
    content:
      "オブジェクトとキーを受け取り、そのキーを削除した新しいオブジェクトを返してください。",
    template:
      "// ① 定数\nconst obj = {a:1,b:2,c:3};\nconst key = 'b';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "キーの削除",
    example: "引数: ({a:1,b:2,c:3}, 'b') => {a:1,c:3}",
    exampleAnswer:
      "const removeKey = (o,k) => {\n  const { [k]:_, ...rest } = o;\n  return rest;\n};\nconst obj = {a:1,b:2,c:3};\nconst key = 'b';\nconsole.log(removeKey(obj,key)); // {a:1,c:3}",
  },

  {
    id: 41,
    lessonId: 1,
    content:
      "高階関数: 配列とコールバック関数を受け取り、各要素にコールバックを適用した配列を返してください。（map相当）",
    template:
      "// ① 定数\nconst arr = [1,2,3];\n// コールバックの例: x => x * 2\n\n// ② 関数定義\n\n// ③ 実行",
    title: "独自Map関数",
    example: "引数: [1,2,3], x=>x*2 => [2,4,6]",
    exampleAnswer:
      "const myMap = (arr, fn) => {\n  return arr.reduce((acc,cur)=>[...acc, fn(cur)],[]);\n};\nconst arr = [1,2,3];\nconsole.log(myMap(arr, x=>x*2)); // [2,4,6]",
  },
  {
    id: 42,
    lessonId: 1,
    content:
      "高階関数: 配列とコールバックを受け取り、コールバックがtrueを返す要素だけの配列を返してください。（filter相当）",
    template:
      "// ① 定数\nconst arr = [1,2,3,4];\n// コールバック例: x => x % 2 === 0\n\n// ② 関数定義\n\n// ③ 実行",
    title: "独自Filter関数",
    example: "引数: [1,2,3,4], x=>x%2===0 => [2,4]",
    exampleAnswer:
      "const myFilter = (arr, fn) => {\n  return arr.reduce((acc,cur)=> fn(cur)? [...acc,cur] : acc, []);\n};\nconst arr = [1,2,3,4];\nconsole.log(myFilter(arr, x=>x%2===0)); // [2,4]",
  },
  {
    id: 43,
    lessonId: 1,
    content:
      "高階関数: 配列と初期値、コールバックを受け取り、左から演算して1つの値に畳み込んで返してください。（reduce相当）",
    template:
      "// ① 定数\nconst arr = [1,2,3];\n// コールバック例: (acc,cur) => acc + cur\nconst initial = 0;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "独自Reduce関数",
    example: "引数: [1,2,3], 0, (acc,cur)=>acc+cur => 6",
    exampleAnswer:
      "const myReduce = (arr, fn, init) => {\n  let result = init;\n  for(const val of arr){\n    result = fn(result, val);\n  }\n  return result;\n};\nconst arr = [1,2,3];\nconsole.log(myReduce(arr, (acc,cur)=>acc+cur, 0)); // 6",
  },
  {
    id: 44,
    lessonId: 1,
    content:
      "高階関数: 文字列配列を受け取り、全てを大文字に変換した配列を返す関数を作成してください（map使用または実装）。",
    template:
      "// ① 定数\nconst arr = ['a','b','c'];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "大文字変換Map",
    example: "引数: ['a','b','c'] => ['A','B','C']",
    exampleAnswer:
      "const toUpperAll = arr => arr.map(s=>s.toUpperCase());\nconst arr = ['a','b','c'];\nconsole.log(toUpperAll(arr)); // ['A','B','C']",
  },
  {
    id: 45,
    lessonId: 1,
    content:
      "高階関数: 数字配列を受け取り、コールバックで指定した条件をすべて満たすか判定してください（every相当）。",
    template:
      "// ① 定数\nconst arr = [2,4,6];\n// コールバック例: x => x % 2 === 0\n\n// ② 関数定義\n\n// ③ 実行",
    title: "独自Every関数",
    example: "引数: [2,4,6], x=>x%2===0 => true",
    exampleAnswer:
      "const myEvery = (arr, fn) => {\n  for(const val of arr){\n    if(!fn(val)) return false;\n  }\n  return true;\n};\nconst arr = [2,4,6];\nconsole.log(myEvery(arr, x=>x%2===0)); // true",
  },

  {
    id: 46,
    lessonId: 1,
    content:
      "非同期処理: setTimeoutを使って、指定秒数後に文字列を表示してください。",
    template:
      "// ① 定数\nconst message = 'Hello';\nconst delay = 1000; // ms\n\n// ② 関数定義\n\n// ③ 実行",
    title: "setTimeoutで表示",
    example: "1秒後に 'Hello' を表示",
    exampleAnswer:
      "const showMessageAfterDelay = (msg,ms) => {\n  setTimeout(()=>console.log(msg), ms);\n};\nconst message = 'Hello';\nconst delay = 1000;\nshowMessageAfterDelay(message, delay);",
  },
  {
    id: 47,
    lessonId: 1,
    content:
      "非同期処理: Promiseを返す関数を作成し、成功時には 'OK' を返し、失敗時には 'NG' を返してください。",
    template:
      "// ① 定数\nconst isSuccess = true;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "Promiseの基本",
    example: "引数: true => 'OK'、 false => 'NG'",
    exampleAnswer:
      "const getPromise = success => {\n  return new Promise((resolve,reject)=>{\n    if(success) resolve('OK');\n    else reject('NG');\n  });\n};\n\nconst isSuccess = true;\ngetPromise(isSuccess)\n  .then(res=>console.log(res))\n  .catch(err=>console.log(err));",
  },
  {
    id: 48,
    lessonId: 1,
    content:
      "非同期処理: async/await を使って、1秒後に完了する処理を待機して結果を表示してください。",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "async/awaitの基本",
    example: "1秒後に 'done' を表示",
    exampleAnswer:
      "const waitOneSec = () => {\n  return new Promise(res=>setTimeout(()=>res('done'),1000));\n};\n\nconst asyncFunc = async () => {\n  const result = await waitOneSec();\n  console.log(result);\n};\n\nasyncFunc();",
  },

  {
    id: 49,
    lessonId: 1,
    content:
      "アルゴリズム: 数値配列を受け取り、バブルソートで昇順に並び替えて返してください。（for文を使わず工夫）",
    template: "// ① 定数\nconst arr = [3,2,1];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "バブルソート",
    example: "引数: [3,2,1] => [1,2,3]",
    exampleAnswer:
      "// 再帰を使った例\nconst bubbleSort = array => {\n  let swapped = false;\n  const arr = [...array];\n  for(let i=0;i<arr.length-1;i++){\n    if(arr[i] > arr[i+1]){\n      [arr[i],arr[i+1]] = [arr[i+1],arr[i]];\n      swapped = true;\n    }\n  }\n  return swapped ? bubbleSort(arr) : arr;\n};\n\nconst arr = [3,2,1];\nconsole.log(bubbleSort(arr)); // [1,2,3]",
  },
  {
    id: 50,
    lessonId: 1,
    content:
      "アルゴリズム: 数値nを受け取り、フィボナッチ数列のn番目の値を返してください。（再帰または配列メソッド）",
    template: "// ① 定数\nconst n = 6;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "フィボナッチ",
    example: "引数: 6 => 8 (0,1,1,2,3,5,8 ...の6番目)",
    exampleAnswer:
      "// 0,1,1,2,3,5,8...\nconst fibonacci = n => {\n  if(n<2) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n};\nconst n = 6;\nconsole.log(fibonacci(n)); // 8",
  },
];

const lesson2Questions: Question[] = [
  {
    id: 51,
    lessonId: 2,
    content:
      "数値を受け取り、負なら絶対値に変換して返す関数を作成してください。",
    template: "// ① 定数\nconst num = -10;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "絶対値への変換",
    example: "引数: -10 => 10",
    exampleAnswer:
      "const toAbsolute = n => n < 0 ? -n : n;\nconst num = -10;\nconsole.log(toAbsolute(num)); // 10",
  },
  {
    id: 52,
    lessonId: 2,
    content:
      "複数の数値を可変長引数(...nums)で受け取り、最小値を返す関数を作成してください。",
    template: "// ① 定数\nconst nums = [5,2,9];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "最小値を返す",
    example: "引数: [5,2,9] => 2",
    exampleAnswer:
      "const min = (...nums) => Math.min(...nums);\nconst nums = [5,2,9];\nconsole.log(min(...nums)); // 2",
  },
  {
    id: 53,
    lessonId: 2,
    content:
      "2つの数値を受け取り、最大公約数（GCD）を返す関数を作成してください。",
    template:
      "// ① 定数\nconst a = 12;\nconst b = 18;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "最大公約数",
    example: "引数: (12,18) => 6",
    exampleAnswer:
      "const gcd = (x,y) => y===0 ? x : gcd(y, x%y);\nconst a = 12;\nconst b = 18;\nconsole.log(gcd(a,b)); // 6",
  },
  {
    id: 54,
    lessonId: 2,
    content:
      "数値を受け取り、素数かどうか判定してtrue/falseを返す関数を作成してください。",
    template: "// ① 定数\nconst num = 13;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "素数判定",
    example: "引数: 13 => true",
    exampleAnswer:
      "const isPrime = n => {\n  if(n<2) return false;\n  for(let i=2; i<=Math.sqrt(n); i++){\n    if(n % i === 0) return false;\n  }\n  return true;\n};\nconst num = 13;\nconsole.log(isPrime(num)); // true",
  },
  {
    id: 55,
    lessonId: 2,
    content:
      "文字列を受け取り、パリンドローム(回文)かどうか判定しtrue/falseを返す関数を作成してください。",
    template: "// ① 定数\nconst str = 'racecar';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "回文判定",
    example: "引数: 'racecar' => true",
    exampleAnswer:
      "const isPalindrome = s => {\n  const rev = s.split('').reverse().join('');\n  return s === rev;\n};\nconst str = 'racecar';\nconsole.log(isPalindrome(str)); // true",
  },
  {
    id: 56,
    lessonId: 2,
    content:
      "文字列を受け取り、母音(a,i,u,e,o)の数を数えて返す関数を作成してください。",
    template:
      "// ① 定数\nconst str = 'javascript';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "母音のカウント",
    example: "引数: 'javascript' => 3 (a,a,i)",
    exampleAnswer:
      "const countVowels = s => s.split('').filter(ch=>'aiueo'.includes(ch.toLowerCase())).length;\nconst str = 'javascript';\nconsole.log(countVowels(str)); // 3",
  },
  {
    id: 57,
    lessonId: 2,
    content:
      "配列を受け取り、すべての要素が重複なしでユニークかどうか判定してください(true/false)。",
    template: "// ① 定数\nconst arr = [1,2,3,2];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "配列のユニーク判定",
    example: "引数: [1,2,3,2] => false",
    exampleAnswer:
      "const allUnique = arr => new Set(arr).size === arr.length;\nconst arr = [1,2,3,2];\nconsole.log(allUnique(arr)); // false",
  },
  {
    id: 58,
    lessonId: 2,
    content:
      "配列を受け取り、すべての要素が数値の場合のみ合計値を返し、それ以外が含まれる場合はnullを返してください。",
    template: "// ① 定数\nconst arr = [1,2,3];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "数値配列の合計 or null",
    example: "引数: [1,2,3] => 6, [1,'x',3] => null",
    exampleAnswer:
      "const sumIfAllNumbers = arr => {\n  if(arr.every(x=>typeof x==='number')){\n    return arr.reduce((a,b)=>a+b,0);\n  }\n  return null;\n};\nconst arr = [1,2,3];\nconsole.log(sumIfAllNumbers(arr)); // 6",
  },
  {
    id: 59,
    lessonId: 2,
    content:
      "配列を受け取り、インデックスが偶数番目の要素だけを抽出した配列を返してください。",
    template:
      "// ① 定数\nconst arr = ['a','b','c','d','e'];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "偶数番目の要素",
    example: "引数: ['a','b','c','d','e'] => ['a','c','e']",
    exampleAnswer:
      "const evenIndexElements = arr => arr.filter((x,i)=>i%2===0);\nconst arr = ['a','b','c','d','e'];\nconsole.log(evenIndexElements(arr)); // ['a','c','e']",
  },
  {
    id: 60,
    lessonId: 2,
    content:
      "配列を受け取り、同じ値が連続している部分を一回にまとめた配列を返してください。",
    template:
      "// ① 定数\nconst arr = [1,1,2,2,2,3,1,1];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "連続部分の圧縮",
    example: "引数: [1,1,2,2,2,3,1,1] => [1,2,3,1]",
    exampleAnswer:
      "const compress = arr => arr.filter((x,i)=> i===0 || x!==arr[i-1]);\nconst arr = [1,1,2,2,2,3,1,1];\nconsole.log(compress(arr)); // [1,2,3,1]",
  },
  {
    id: 61,
    lessonId: 2,
    content: "2つの配列を受け取り、共通する要素だけを返してください。",
    template:
      "// ① 定数\nconst arr1 = [1,2,3];\nconst arr2 = [2,3,4];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "共通要素の抽出",
    example: "引数: [1,2,3],[2,3,4] => [2,3]",
    exampleAnswer:
      "const intersection = (a1,a2) => a1.filter(x=> a2.includes(x));\nconst arr1 = [1,2,3];\nconst arr2 = [2,3,4];\nconsole.log(intersection(arr1,arr2)); // [2,3]",
  },
  {
    id: 62,
    lessonId: 2,
    content:
      "配列を受け取り、要素をすべて文字列に変換し、さらに文字列長の降順にソートして返してください。",
    template:
      "// ① 定数\nconst arr = [true, 123, 'apple'];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "文字列化して降順ソート",
    example: "引数: [true,123,'apple'] => ['apple','true','123'] (length順)",
    exampleAnswer:
      "const sortByStrLengthDesc = arr => {\n  return arr.map(x=>String(x)).sort((a,b)=>b.length-a.length);\n};\nconst arr = [true, 123, 'apple'];\nconsole.log(sortByStrLengthDesc(arr)); // ['apple','true','123']",
  },
  {
    id: 63,
    lessonId: 2,
    content:
      "文字列を受け取り、単語を逆順に並べ替えて返してください。（単語自体は反転しない）",
    template:
      "// ① 定数\nconst str = 'one two three';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "単語順の反転",
    example: "引数: 'one two three' => 'three two one'",
    exampleAnswer:
      "const reverseWords = s => s.split(' ').reverse().join(' ');\nconst str = 'one two three';\nconsole.log(reverseWords(str)); // three two one",
  },
  {
    id: 64,
    lessonId: 2,
    content:
      "文字列を受け取り、単語ごとに先頭文字を大文字にして返してください。（複数単語）",
    template:
      "// ① 定数\nconst str = 'hello world js';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "単語の先頭大文字化",
    example: "引数: 'hello world js' => 'Hello World Js'",
    exampleAnswer:
      "const capitalizeWords = s => s.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');\nconst str = 'hello world js';\nconsole.log(capitalizeWords(str)); // Hello World Js",
  },
  {
    id: 65,
    lessonId: 2,
    content:
      "2つの文字列を受け取り、一方が他方のアナグラム（文字構成が同じ）かどうか判定してください。",
    template:
      "// ① 定数\nconst str1 = 'listen';\nconst str2 = 'silent';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "アナグラム判定",
    example: "引数: ('listen','silent') => true",
    exampleAnswer:
      "const isAnagram = (s1,s2) => {\n  const sortStr = s => s.split('').sort().join('');\n  return sortStr(s1)===sortStr(s2);\n};\nconst str1 = 'listen';\nconst str2 = 'silent';\nconsole.log(isAnagram(str1,str2)); // true",
  },
  {
    id: 66,
    lessonId: 2,
    content:
      "オブジェクト配列を受け取り、指定したキーの値が昇順になるようにソートして返してください。",
    template:
      "// ① 定数\nconst arr = [\n  {name:'Taro', age:30},\n  {name:'Jiro', age:25},\n  {name:'Hanako', age:35}\n];\nconst key = 'age';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "オブジェクト配列のソート",
    example: "引数: key='age' => age:25,30,35の順",
    exampleAnswer:
      "const sortByKey = (arr, k) => [...arr].sort((a,b)=> a[k] - b[k]);\nconst arr = [\n  {name:'Taro', age:30},\n  {name:'Jiro', age:25},\n  {name:'Hanako', age:35}\n];\nconsole.log(sortByKey(arr,'age'));",
  },
  {
    id: 67,
    lessonId: 2,
    content:
      "オブジェクト配列を受け取り、特定のキーの重複を除いた配列を返してください。",
    template:
      "// ① 定数\nconst arr = [\n  {id:1, val:'a'},\n  {id:2, val:'a'},\n  {id:3, val:'b'}\n];\nconst key = 'val';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "オブジェクト配列の重複除去",
    example: "引数: val => [{id:1, val:'a'}, {id:3, val:'b'}]",
    exampleAnswer:
      "const uniqueByKey = (arr,k) => {\n  const seen = new Set();\n  return arr.filter(obj=>{\n    if(seen.has(obj[k])) return false;\n    seen.add(obj[k]);\n    return true;\n  });\n};\n\nconst arr = [\n  {id:1, val:'a'},\n  {id:2, val:'a'},\n  {id:3, val:'b'}\n];\nconsole.log(uniqueByKey(arr,'val'));",
  },
  {
    id: 68,
    lessonId: 2,
    content:
      "オブジェクトを受け取り、値がオブジェクトの場合に再帰的に処理して、全てのプロパティを『key=value』形式の配列で返してください。",
    template:
      "// ① 定数\nconst obj = {\n  a: 1,\n  b: { b1: 21, b2: 22 },\n  c: 3\n};\n\n// ② 関数定義\n\n// ③ 実行",
    title: "オブジェクトの再帰的フラット化",
    example:
      "引数: {a:1, b:{b1:21,b2:22}, c:3} => ['a=1','b1=21','b2=22','c=3']",
    exampleAnswer:
      "const flattenObject = o => {\n  let result=[];\n  const helper = (obj) => {\n    for(const [k,v] of Object.entries(obj)){\n      if(typeof v==='object' && v!==null){\n        helper(v);\n      } else {\n        result.push(`${k}=${v}`);\n      }\n    }\n  };\n  helper(o);\n  return result;\n};\n\nconst obj = {\n  a:1,\n  b:{ b1:21, b2:22},\n  c:3\n};\nconsole.log(flattenObject(obj));",
  },
  {
    id: 69,
    lessonId: 2,
    content:
      "オブジェクト配列を受け取り、指定キーの値だけを抜き出した配列を返してください。",
    template:
      "// ① 定数\nconst arr = [\n  {name:'Taro', age:20},\n  {name:'Jiro', age:25}\n];\nconst key = 'name';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "キーの値抽出",
    example: "引数: key='name' => ['Taro','Jiro']",
    exampleAnswer:
      "const pluck = (arr,k) => arr.map(obj=>obj[k]);\nconst arr = [\n  {name:'Taro', age:20},\n  {name:'Jiro', age:25}\n];\nconsole.log(pluck(arr,'name')); // ['Taro','Jiro']",
  },
  {
    id: 70,
    lessonId: 2,
    content:
      "高階関数: 配列を受け取り、要素が全てユニークかどうか判定する関数を、everyとindexOfを使って作成してください。",
    template: "// ① 定数\nconst arr = [1,2,3,2];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "everyを使ったユニーク判定",
    example: "引数: [1,2,3,2] => false",
    exampleAnswer:
      "const isUniqueUsingEvery = arr => arr.every((x,i)=> arr.indexOf(x)===i);\nconst arr = [1,2,3,2];\nconsole.log(isUniqueUsingEvery(arr)); // false",
  },
  {
    id: 71,
    lessonId: 2,
    content:
      "高階関数: 文字列配列を受け取り、コールバックで指定した文字数以上の要素だけを返してください（filter相当）。",
    template:
      "// ① 定数\nconst arr = ['apple','hi','banana'];\n// コールバック例: s=>s.length>=5\n\n// ② 関数定義\n\n// ③ 実行",
    title: "文字数フィルタ",
    example: "引数: ['apple','hi','banana'] => ['apple','banana'] (length>=5)",
    exampleAnswer:
      "const filterByLength = (arr,fn) => arr.filter(fn);\nconst arr = ['apple','hi','banana'];\nconsole.log(filterByLength(arr, s=>s.length>=5));",
  },
  {
    id: 72,
    lessonId: 2,
    content:
      "高階関数: 数値配列を受け取り、すべてに2を足した後、さらに合計を求めて返してください（map + reduce）。",
    template: "// ① 定数\nconst arr = [1,2,3];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "map + reduce",
    example: "引数: [1,2,3] => 1+2+3 に各+2 => [3,4,5] => 合計12",
    exampleAnswer:
      "const addTwoThenSum = arr => arr.map(x=>x+2).reduce((a,b)=>a+b,0);\nconst arr = [1,2,3];\nconsole.log(addTwoThenSum(arr)); // 12",
  },
  {
    id: 73,
    lessonId: 2,
    content:
      "高階関数: 配列を受け取り、すべての要素を文字列に変換し連結した文字列を返してください（map + reduce）。",
    template:
      "// ① 定数\nconst arr = [1,true,'x'];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "連結文字列の作成",
    example: "引数: [1,true,'x'] => '1truex'",
    exampleAnswer:
      "const joinAllAsString = arr => arr.map(x=>String(x)).reduce((a,b)=>a+b,'');\nconst arr = [1,true,'x'];\nconsole.log(joinAllAsString(arr)); // 1truex",
  },
  {
    id: 74,
    lessonId: 2,
    content:
      "非同期処理: fetchの代わりにPromiseを使い、疑似的にJSONデータを返す関数を作成してください。",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "疑似fetch",
    example: "成功時に {data: 'Hello'} を返す",
    exampleAnswer:
      "const pseudoFetch = () => {\n  return new Promise((resolve) => {\n    setTimeout(()=>resolve({data:'Hello'}), 500);\n  });\n};\n\npseudoFetch().then(res=>console.log(res)); // {data:'Hello'}",
  },
  {
    id: 75,
    lessonId: 2,
    content:
      "非同期処理: async/await で疑似的なAPI呼び出しを行い、返されたデータを加工して表示してください。",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "async/awaitで疑似API",
    example: "返ってきた {name:'Taro'} を 'User:Taro' の形で表示",
    exampleAnswer:
      "const mockAPI = () => new Promise(res=>setTimeout(()=>res({name:'Taro'}),500));\n\nconst main = async () => {\n  const data = await mockAPI();\n  console.log(`User:${data.name}`);\n};\n\nmain();",
  },
  {
    id: 76,
    lessonId: 2,
    content:
      "アルゴリズム: クイックソートで配列を昇順にソートして返してください。",
    template:
      "// ① 定数\nconst arr = [3,1,4,1,5];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "クイックソート",
    example: "引数: [3,1,4,1,5] => [1,1,3,4,5]",
    exampleAnswer:
      "const quickSort = array => {\n  if(array.length<2) return array;\n  const pivot = array[0];\n  const left = array.slice(1).filter(x=>x<=pivot);\n  const right = array.slice(1).filter(x=>x>pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n};\nconst arr = [3,1,4,1,5];\nconsole.log(quickSort(arr));",
  },
  {
    id: 77,
    lessonId: 2,
    content:
      "アルゴリズム: 2分探索を用いて、ソート済み配列から特定の値を探し、そのインデックスを返す関数を作成してください。見つからない場合は-1。",
    template:
      "// ① 定数\nconst arr = [1,2,3,4,5];\nconst target = 3;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "2分探索",
    example: "引数: [1,2,3,4,5], 3 => 2",
    exampleAnswer:
      "const binarySearch = (arr, val, left=0, right=arr.length-1) => {\n  if(left>right) return -1;\n  const mid = Math.floor((left+right)/2);\n  if(arr[mid]===val) return mid;\n  if(arr[mid]>val) return binarySearch(arr,val,left,mid-1);\n  else return binarySearch(arr,val,mid+1,right);\n};\n\nconst arr = [1,2,3,4,5];\nconsole.log(binarySearch(arr,3)); // 2",
  },
  {
    id: 78,
    lessonId: 2,
    content:
      "アルゴリズム: 数値配列を受け取り、mergeSortでソートして返してください。",
    template:
      "// ① 定数\nconst arr = [5,2,4,6,1,3];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "マージソート",
    example: "引数: [5,2,4,6,1,3] => [1,2,3,4,5,6]",
    exampleAnswer:
      "const mergeSort = arr => {\n  if(arr.length<2) return arr;\n  const mid = Math.floor(arr.length/2);\n  const left = mergeSort(arr.slice(0,mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left,right);\n};\n\nconst merge = (l,r) => {\n  const result=[];\n  while(l.length && r.length){\n    result.push(l[0]<r[0] ? l.shift():r.shift());\n  }\n  return [...result,...l,...r];\n};\n\nconst arr = [5,2,4,6,1,3];\nconsole.log(mergeSort(arr)); // [1,2,3,4,5,6]",
  },
  {
    id: 79,
    lessonId: 2,
    content:
      "アルゴリズム: 数値nを受け取り、フィボナッチ数列のn番目をメモ化(Memoization)を使って効率的に求めてください。",
    template: "// ① 定数\nconst n = 10;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "メモ化フィボナッチ",
    example: "引数: 10 => 55",
    exampleAnswer:
      "const fibMemo = () => {\n  const memo = {};\n  const f = x => {\n    if(x<2) return x;\n    if(memo[x]) return memo[x];\n    memo[x] = f(x-1) + f(x-2);\n    return memo[x];\n  };\n  return f;\n};\nconst fib = fibMemo();\nconst n = 10;\nconsole.log(fib(n)); // 55",
  },
  {
    id: 80,
    lessonId: 2,
    content:
      "アルゴリズム: 2つの文字列を受け取り、レーベンシュタイン距離(編集距離)を求めて返してください。（DPで可）",
    template:
      "// ① 定数\nconst str1 = 'kitten';\nconst str2 = 'sitting';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "編集距離",
    example: "引数: ('kitten','sitting') => 3",
    exampleAnswer:
      "const levenshtein = (a,b) => {\n  const dp = Array(b.length+1).fill(null).map(()=>Array(a.length+1).fill(null));\n  for(let i=0;i<=a.length;i++) dp[0][i]=i;\n  for(let j=0;j<=b.length;j++) dp[j][0]=j;\n  for(let j=1;j<=b.length;j++){\n    for(let i=1;i<=a.length;i++){\n      dp[j][i]= Math.min(\n        dp[j-1][i]+1,\n        dp[j][i-1]+1,\n        dp[j-1][i-1]+(a[i-1]===b[j-1]?0:1)\n      );\n    }\n  }\n  return dp[b.length][a.length];\n};\nconst str1 = 'kitten';\nconst str2 = 'sitting';\nconsole.log(levenshtein(str1,str2)); // 3",
  },
  {
    id: 81,
    lessonId: 2,
    content:
      "アルゴリズム: 配列内で2つの数の和が指定値になるようなペアを全て探し、配列で返してください。",
    template:
      "// ① 定数\nconst arr = [2,4,3,5,7];\nconst target = 9;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "2数の和",
    example: "引数: [2,4,3,5,7], target=9 => [[2,7],[4,5]] (順不同)",
    exampleAnswer:
      "const twoSumPairs = (arr, t) => {\n  const res=[];\n  arr.forEach((x,i)=>{\n    arr.slice(i+1).forEach(y=>{\n      if(x+y===t) res.push([x,y]);\n    });\n  });\n  return res;\n};\nconst arr = [2,4,3,5,7];\nconsole.log(twoSumPairs(arr,9)); // [[2,7],[4,5]]",
  },
  {
    id: 82,
    lessonId: 2,
    content:
      "アルゴリズム: 文字列配列を受け取り、最も頻出する文字列を返してください。複数ある場合は最初に出現したもの。",
    template:
      "// ① 定数\nconst arr = ['apple','banana','apple','orange','banana','banana'];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "最頻出要素",
    example:
      "引数: ['apple','banana','apple','orange','banana','banana'] => 'banana'",
    exampleAnswer:
      "const mostFrequent = arr => {\n  const map = {};\n  arr.forEach(x=>map[x]=(map[x]||0)+1);\n  let maxCount=0; let result=null;\n  for(const x of arr){\n    if(map[x]>maxCount){\n      maxCount=map[x];\n      result=x;\n    }\n  }\n  return result;\n};\n\nconst arr = ['apple','banana','apple','orange','banana','banana'];\nconsole.log(mostFrequent(arr)); // 'banana'",
  },
  {
    id: 83,
    lessonId: 2,
    content:
      "アルゴリズム: 文字列を受け取り、連続する数字をひとまとまりにして配列で返してください。（例: 'a12b3' => ['a','12','b','3'])",
    template: "// ① 定数\nconst str = 'a12b3';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "連続数字の分割",
    example: "引数: 'a12b3' => ['a','12','b','3']",
    exampleAnswer:
      "const splitNumbers = s => {\n  return s.split(/(\\d+)/).filter(Boolean);\n};\nconst str = 'a12b3';\nconsole.log(splitNumbers(str)); // ['a','12','b','3']",
  },
  {
    id: 84,
    lessonId: 2,
    content:
      "アルゴリズム: 配列を受け取り、動的計画法を用いて最大連続部分和を求めてください。",
    template:
      "// ① 定数\nconst arr = [-2,1,-3,4,-1,2,1,-5,4];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "最大部分和",
    example: "引数: [-2,1,-3,4,-1,2,1,-5,4] => 6 (4 + -1 + 2 + 1)",
    exampleAnswer:
      "const maxSubArray = arr => {\n  let currentSum=arr[0], maxSum=arr[0];\n  for(let i=1;i<arr.length;i++){\n    currentSum = Math.max(arr[i], currentSum+arr[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n};\nconst arr = [-2,1,-3,4,-1,2,1,-5,4];\nconsole.log(maxSubArray(arr)); // 6",
  },
  {
    id: 85,
    lessonId: 2,
    content:
      "アルゴリズム: 文字列を受け取り、括弧の対応が正しいかどうか判定してください。'('と')'のみ対象。",
    template: "// ① 定数\nconst str = '(())()';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "括弧のバランス",
    example: "引数: '(())()' => true, ')(' => false",
    exampleAnswer:
      "const isValidParentheses = s => {\n  let balance=0;\n  for(const ch of s){\n    if(ch==='(') balance++;\n    else if(ch===')') balance--;\n    if(balance<0) return false;\n  }\n  return balance===0;\n};\nconst str = '(())()';\nconsole.log(isValidParentheses(str)); // true",
  },
  {
    id: 86,
    lessonId: 2,
    content:
      "アルゴリズム: 単方向リスト（配列で擬似）的な構造から、n番目の要素を取得する関数を再帰で実装してください。",
    template:
      "// ① 定数\nconst list = [ {val:1,next:1}, {val:2,next:2}, {val:3,next:null} ];\nconst n = 2; // 0-index\n\n// ② 関数定義\n\n// ③ 実行",
    title: "単方向リストのn番目",
    example: "引数: n=2 => 3 (val)",
    exampleAnswer:
      "// 配列listを[インデックス]で保持していると仮定\nconst getNodeValue = (list, index, current=0) => {\n  if(current===index) return list[current].val;\n  if(list[current].next===null) return undefined;\n  return getNodeValue(list, index, list[current].next);\n};\n\nconst list = [\n  {val:1,next:1},\n  {val:2,next:2},\n  {val:3,next:null}\n];\nconsole.log(getNodeValue(list,2)); // 3",
  },
  {
    id: 87,
    lessonId: 2,
    content:
      "アルゴリズム: 配列を受け取り、再帰を用いて全ての順列を生成して2次元配列で返してください。",
    template: "// ① 定数\nconst arr = [1,2,3];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "全順列の生成",
    example: "引数: [1,2,3] => [[1,2,3],[1,3,2],[2,1,3]...]] (6通り)",
    exampleAnswer:
      "const permute = arr => {\n  if(arr.length<=1) return [arr];\n  return arr.flatMap((x,i)=>{\n    const rest = [...arr.slice(0,i), ...arr.slice(i+1)];\n    return permute(rest).map(p=>[x,...p]);\n  });\n};\nconst arr = [1,2,3];\nconsole.log(permute(arr));",
  },
  {
    id: 88,
    lessonId: 2,
    content:
      "アルゴリズム: 文字列を受け取り、数字以外を除去した数値を返してください。（先頭の0は維持）",
    template: "// ① 定数\nconst str = 'a01b23';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "数字以外の除去",
    example: "引数: 'a01b23' => '0123'",
    exampleAnswer:
      "const extractNumbers = s => s.replace(/[^0-9]/g,'');\nconst str = 'a01b23';\nconsole.log(extractNumbers(str)); // 0123",
  },
  {
    id: 89,
    lessonId: 2,
    content:
      "アルゴリズム: 文字列を受け取り、各文字の出現回数をオブジェクトで返してください。",
    template: "// ① 定数\nconst str = 'abca';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "文字数カウント",
    example: "引数: 'abca' => {a:2,b:1,c:1}",
    exampleAnswer:
      "const charCount = s => {\n  return s.split('').reduce((acc,ch)=>{\n    acc[ch] = (acc[ch]||0)+1;\n    return acc;\n  },{});\n};\nconst str = 'abca';\nconsole.log(charCount(str)); // {a:2,b:1,c:1}",
  },
  {
    id: 90,
    lessonId: 2,
    content:
      "アルゴリズム: 配列を受け取り、再帰的に全ての要素をフラットにした配列を返してください（多重配列対応）。",
    template:
      "// ① 定数\nconst arr = [1,[2,[3,[4]]],5];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "多重配列のフラット化",
    example: "引数: [1,[2,[3,[4]]],5] => [1,2,3,4,5]",
    exampleAnswer:
      "const deepFlatten = arr => {\n  return arr.reduce((acc,cur)=>{\n    return acc.concat(Array.isArray(cur) ? deepFlatten(cur):cur);\n  },[]);\n};\nconst arr = [1,[2,[3,[4]]],5];\nconsole.log(deepFlatten(arr)); // [1,2,3,4,5]",
  },
  {
    id: 91,
    lessonId: 2,
    content:
      "非同期処理: 複数のPromiseを同時に実行し、全て完了後に結果を配列で返す関数を作成してください(Promise.all)。",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "Promise.all の利用",
    example: "成功時 => ['A','B','C'] のような配列が返る",
    exampleAnswer:
      "const promiseA = () => new Promise(res=>setTimeout(()=>res('A'),300));\nconst promiseB = () => new Promise(res=>setTimeout(()=>res('B'),200));\nconst promiseC = () => new Promise(res=>setTimeout(()=>res('C'),100));\n\nconst runAll = async () => {\n  const results = await Promise.all([promiseA(), promiseB(), promiseC()]);\n  console.log(results);\n};\n\nrunAll();",
  },
  {
    id: 92,
    lessonId: 2,
    content:
      "非同期処理: Promise.race を使って、最も早く完了した結果を返す関数を作成してください。",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "Promise.race の利用",
    example: "最初に完了したPromiseの結果を表示",
    exampleAnswer:
      "const raceDemo = async () => {\n  const p1 = new Promise(res=>setTimeout(()=>res('fast'),100));\n  const p2 = new Promise(res=>setTimeout(()=>res('slow'),500));\n  const result = await Promise.race([p1,p2]);\n  console.log(result); // fast\n};\nraceDemo();",
  },
  {
    id: 93,
    lessonId: 2,
    content:
      "非同期処理: async/await と try/catch を使って、エラーが出た場合に'Error'と表示してください。",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "asyncエラー処理",
    example: "Promiseがreject => 'Error'を表示",
    exampleAnswer:
      "const mightFail = () => new Promise((_,rej)=>setTimeout(()=>rej('fail'),100));\n\nconst main = async () => {\n  try {\n    const res = await mightFail();\n    console.log(res);\n  } catch(e){\n    console.log('Error');\n  }\n};\nmain();",
  },
  {
    id: 94,
    lessonId: 2,
    content:
      "アルゴリズム: 与えられた数値nが2のべき乗かどうかを判定してください。（ビット演算 or 再帰など）",
    template: "// ① 定数\nconst n = 16;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "2のべき乗判定",
    example: "引数: 16 => true, 18 => false",
    exampleAnswer:
      "const isPowerOfTwo = n => n>0 && (n & (n-1))===0;\nconst n = 16;\nconsole.log(isPowerOfTwo(n)); // true",
  },
  {
    id: 95,
    lessonId: 2,
    content:
      "アルゴリズム: 文字列を受け取り、全ての組み合わせ(順不同)を配列で返してください。（'ab' => '', 'a', 'b', 'ab'）",
    template: "// ① 定数\nconst str = 'ab';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "文字列の部分集合",
    example: "引数: 'ab' => ['', 'a', 'b', 'ab']",
    exampleAnswer:
      "const subsets = s => {\n  const res=[];\n  const chars = s.split('');\n  const backtrack = (index,combo) => {\n    if(index===chars.length){\n      res.push(combo.join(''));\n      return;\n    }\n    // 追加しない\n    backtrack(index+1, combo);\n    // 追加する\n    combo.push(chars[index]);\n    backtrack(index+1, combo);\n    combo.pop();\n  };\n  backtrack(0,[]);\n  return res;\n};\nconst str = 'ab';\nconsole.log(subsets(str)); // ['', 'a', 'b', 'ab']",
  },
  {
    id: 96,
    lessonId: 2,
    content:
      "アルゴリズム: 数値を受け取り、階乗(n!)を求めて返してください。（再帰またはループ）",
    template: "// ① 定数\nconst n = 5;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "階乗",
    example: "引数: 5 => 120",
    exampleAnswer:
      "const factorial = x => x<2 ? 1 : x*factorial(x-1);\nconst n = 5;\nconsole.log(factorial(n)); // 120",
  },
  {
    id: 97,
    lessonId: 2,
    content:
      "アルゴリズム: 数値配列を受け取り、指定した長さの連続部分配列の最大合計を求めてください。（スライドウィンドウ）",
    template:
      "// ① 定数\nconst arr = [2,1,5,1,3,2];\nconst windowSize = 2;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "連続部分配列の最大合計",
    example: "引数: [2,1,5,1,3,2], size=2 => 6 (5+1が最大)",
    exampleAnswer:
      "const maxSubarraySum = (arr,size) => {\n  if(size>arr.length) return null;\n  let sum = arr.slice(0,size).reduce((a,b)=>a+b,0);\n  let max = sum;\n  for(let i=size;i<arr.length;i++){\n    sum += arr[i] - arr[i-size];\n    if(sum>max) max=sum;\n  }\n  return max;\n};\n\nconst arr = [2,1,5,1,3,2];\nconst windowSize = 2;\nconsole.log(maxSubarraySum(arr, windowSize)); // 6",
  },
  {
    id: 98,
    lessonId: 2,
    content:
      "アルゴリズム: 配列を受け取り、マージソートを応用して重複を除去した上でソートした配列を返してください。",
    template:
      "// ① 定数\nconst arr = [3,1,2,3,2,4];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "ソート＋重複除去",
    example: "引数: [3,1,2,3,2,4] => [1,2,3,4]",
    exampleAnswer:
      "const mergeSortUnique = arr => {\n  const sorted = mergeSort([...new Set(arr)]);\n  return sorted;\n};\n\nconst mergeSort = a => {\n  if(a.length<2) return a;\n  const mid = Math.floor(a.length/2);\n  const left = mergeSort(a.slice(0,mid));\n  const right = mergeSort(a.slice(mid));\n  return merge(left,right);\n};\n\nconst merge = (l,r)=>{\n  const result=[];\n  while(l.length&&r.length){\n    result.push(l[0]<r[0]?l.shift():r.shift());\n  }\n  return [...result, ...l, ...r];\n};\n\nconst arr = [3,1,2,3,2,4];\nconsole.log(mergeSortUnique(arr)); // [1,2,3,4]",
  },
  {
    id: 99,
    lessonId: 2,
    content:
      "アルゴリズム: 重複した文字をまとめて縮めるランレングス圧縮を実装してください。（例: 'aaabbc' => 'a3b2c1'）",
    template: "// ① 定数\nconst str = 'aaabbc';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "ランレングス圧縮",
    example: "引数: 'aaabbc' => 'a3b2c1'",
    exampleAnswer:
      "const runLengthEncode = s => {\n  let res='';\n  let count=1;\n  for(let i=0;i<s.length;i++){\n    if(s[i]===s[i+1]){\n      count++;\n    } else {\n      res += s[i] + count;\n      count=1;\n    }\n  }\n  return res;\n};\nconst str = 'aaabbc';\nconsole.log(runLengthEncode(str)); // a3b2c1",
  },
  {
    id: 100,
    lessonId: 2,
    content:
      "アルゴリズム: 迷路探索(2次元配列)を想定し、スタートからゴールに到達可能かDFSで判定してください。（壁=0,道=1）",
    template:
      "// ① 定数\nconst maze = [\n  [1,1,0],\n  [0,1,1],\n  [1,0,1]\n];\nconst start = [0,0];\nconst goal = [2,2];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "DFSによる迷路探索",
    example: "引数: maze, start=[0,0], goal=[2,2] => true/false",
    exampleAnswer:
      "const canReach = (maze, [sx,sy], [gx,gy]) => {\n  const rows=maze.length; const cols=maze[0].length;\n  const visited = Array.from({length:rows}, ()=> Array(cols).fill(false));\n\n  const dfs = (x,y)=>{\n    if(x<0||y<0||x>=rows||y>=cols) return false;\n    if(!maze[x][y]) return false;\n    if(visited[x][y]) return false;\n    visited[x][y]=true;\n    if(x===gx && y===gy) return true;\n    return dfs(x+1,y)||dfs(x-1,y)||dfs(x,y+1)||dfs(x,y-1);\n  };\n\n  return dfs(sx,sy);\n};\n\nconst maze = [\n  [1,1,0],\n  [0,1,1],\n  [1,0,1]\n];\nconsole.log(canReach(maze,[0,0],[2,2]));",
  },
];

const lesson3Questions: Question[] = [
  {
    id: 101,
    lessonId: 3,
    content:
      "Generator関数を使って、0から指定数値まで1ずつ返すイテレーターを作成してください。",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "ジェネレーター基礎",
    example: "引数: 3 => yield: 0,1,2,3",
    exampleAnswer:
      "function* rangeGen(n){\n  for(let i=0;i<=n;i++){\n    yield i;\n  }\n}\n\nconst gen = rangeGen(3);\nfor(const val of gen){\n  console.log(val);\n}",
  },
  {
    id: 102,
    lessonId: 3,
    content:
      "Proxyを使って、あらゆるプロパティアクセスをログ出力するオブジェクトを作成してください。",
    template:
      "// ① 定数\nconst target = {a:1,b:2};\n\n// ② 関数定義 or 直接実装\n\n// ③ 実行",
    title: "Proxyでアクセサログ",
    example: "target.a を読み込んだ時に 'get a' とログ",
    exampleAnswer:
      "const target = {a:1,b:2};\nconst handler = {\n  get(obj, prop){\n    console.log('get', prop);\n    return obj[prop];\n  }\n};\n\nconst proxyObj = new Proxy(target, handler);\nconsole.log(proxyObj.a); // get a -> 1",
  },
  {
    id: 103,
    lessonId: 3,
    content:
      "Reflectを使って、オブジェクトのプロパティ操作（取得・設定・削除）を行う関数を作成してください。",
    template: "// ① 定数\nconst obj = {x:10};\n\n// ② 関数定義\n\n// ③ 実行",
    title: "Reflectの使用",
    example: "Reflect.get / Reflect.set / Reflect.deleteProperty などを使用",
    exampleAnswer:
      "const manipulateObj = o => {\n  console.log('x=', Reflect.get(o,'x'));\n  Reflect.set(o,'y',20);\n  console.log('y=', Reflect.get(o,'y'));\n  Reflect.deleteProperty(o,'x');\n  return o;\n};\n\nconst obj = {x:10};\nconsole.log(manipulateObj(obj)); // {y:20}",
  },
  {
    id: 104,
    lessonId: 3,
    content:
      "正規表現を使って、文字列からメールアドレスらしき部分を全て抽出し、配列で返してください。",
    template:
      "// ① 定数\nconst str = '連絡は test@example.com または info@test.co.jp へ';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "メールアドレス抽出",
    example:
      "引数: '連絡は test@example.com または info@test.co.jp へ' => ['test@example.com','info@test.co.jp']",
    exampleAnswer:
      "const extractEmails = s => {\n  const pattern = /[\\w.%-]+@[\\w.-]+\\.[a-zA-Z]{2,}/g;\n  return s.match(pattern)||[];\n};\nconst str = '連絡は test@example.com または info@test.co.jp へ';\nconsole.log(extractEmails(str));",
  },
  {
    id: 105,
    lessonId: 3,
    content:
      "AsyncGenerator関数を使って、一定間隔で値をyieldする関数を作成し、for-await-ofで取得してください。",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "AsyncGeneratorの使用",
    example: "1秒ごとに 0,1,2,... をyieldし、3つ取得後に終了",
    exampleAnswer:
      "async function* asyncCounter(limit){\n  for(let i=0;i<limit;i++){\n    await new Promise(res=>setTimeout(res,1000));\n    yield i;\n  }\n}\n\n(async ()=>{\n  for await(const val of asyncCounter(3)){\n    console.log(val);\n  }\n})();",
  },
  {
    id: 106,
    lessonId: 3,
    content:
      "Web API（fetchなど）を利用しないで、Node.js の http/https モジュールを想定した仮の非同期通信関数をPromiseでラップしてください。",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "Node.js http通信のPromiseラップ",
    example: "http.get をPromise化した例",
    exampleAnswer:
      "const pseudoHttpGet = (url) => {\n  return new Promise((resolve,reject)=>{\n    // 仮の非同期: 成功とする\n    setTimeout(()=>{\n      if(url) resolve(`Response from ${url}`);\n      else reject('Invalid URL');\n    },500);\n  });\n};\n\npseudoHttpGet('http://example.com')\n  .then(res=>console.log(res))\n  .catch(err=>console.log(err));",
  },
  {
    id: 107,
    lessonId: 3,
    content:
      "関数のメモ化（Memoization）を一般化する高階関数を作成してください。キャッシュはMapを使用してください。",
    template: "// ① 関数定義\n\n// ② 実行例",
    title: "汎用メモ化関数",
    example: "引数の組み合わせごとにキャッシュする",
    exampleAnswer:
      "const memoize = fn => {\n  const cache = new Map();\n  return (...args)=>{\n    const key = JSON.stringify(args);\n    if(cache.has(key)) return cache.get(key);\n    const result = fn(...args);\n    cache.set(key,result);\n    return result;\n  };\n};\n\n// 使用例\nconst slowFunc = n => {\n  // 重い処理を想定\n  return n*n;\n};\n\nconst fastFunc = memoize(slowFunc);\nconsole.log(fastFunc(10)); // 初回は計算\nconsole.log(fastFunc(10)); // 2回目はキャッシュ",
  },
  {
    id: 108,
    lessonId: 3,
    content:
      "イベント駆動: 簡易的なイベントエミッタクラスを実装し、on/emit/off を提供してください。",
    template: "// ① クラス定義\n\n// ② 使用例",
    title: "イベントエミッタ",
    example: "on('test',...) で登録, emit('test',...) で呼び出し",
    exampleAnswer:
      "class EventEmitter {\n  constructor(){\n    this.events={};\n  }\n  on(name, listener){\n    if(!this.events[name]) this.events[name]=[];\n    this.events[name].push(listener);\n  }\n  emit(name, ...args){\n    if(this.events[name]){\n      this.events[name].forEach(fn=>fn(...args));\n    }\n  }\n  off(name, listener){\n    if(this.events[name]){\n      this.events[name] = this.events[name].filter(fn=>fn!==listener);\n    }\n  }\n}\n\n// 使用例\nconst ee = new EventEmitter();\nconst fn = msg => console.log('Received:', msg);\nee.on('test', fn);\nee.emit('test','Hello'); // Received: Hello\nee.off('test', fn);",
  },
  {
    id: 109,
    lessonId: 3,
    content:
      "コールスタックの理解: setTimeout(0)を使って、同期処理が終わった後に実行される非同期動作を確認する関数を作成してください。",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "setTimeout(0)の挙動",
    example: "先に同期処理が実行され、最後にタイマーのコールバックが実行される",
    exampleAnswer:
      "const checkStack = () => {\n  console.log('start');\n  setTimeout(()=>console.log('timeout'),0);\n  console.log('end');\n};\n\ncheckStack();\n// 実行結果: start -> end -> timeout",
  },
  {
    id: 110,
    lessonId: 3,
    content:
      "ジェネレータを使って、Promiseを同期的に扱うように見せるrun関数を実装してください。（手動でnext()を繰り返す）",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "ジェネレータでPromise制御",
    example: "Generator内で yield Promise を順番に実行",
    exampleAnswer:
      "function run(generatorFunc){\n  const gen = generatorFunc();\n  function step(nextF){\n    let next;\n    try{\n      next = nextF();\n    }catch(e){\n      return Promise.reject(e);\n    }\n    if(next.done) return Promise.resolve(next.value);\n    return Promise.resolve(next.value).then(\n      v=>step(()=>gen.next(v)),\n      e=>step(()=>gen.throw(e))\n    );\n  }\n  return step(()=>gen.next());\n}\n\nfunction* myGen(){\n  const a = yield Promise.resolve(1);\n  console.log(a);\n  const b = yield Promise.resolve(2);\n  console.log(b);\n}\n\nrun(myGen); // 1 -> 2",
  },
  {
    id: 111,
    lessonId: 3,
    content:
      "ProxyとReflectを組み合わせて、すべてのプロパティが必ず数値になるようなオブジェクトを作成してください。（set時にNumber変換）",
    template: "// ① 定数\nconst target = {};\n\n// ② 生成\n\n// ③ 実行例",
    title: "数値プロパティ強制Proxy",
    example: "proxyObj.x = '100' => 内部的には 100 がセットされる",
    exampleAnswer:
      "const target = {};\nconst handler = {\n  set(obj, prop, value){\n    const numVal = Number(value);\n    if(isNaN(numVal)){\n      throw new Error('value must be a number');\n    }\n    return Reflect.set(obj,prop,numVal);\n  }\n};\n\nconst proxyObj = new Proxy(target, handler);\nproxyObj.x = '100';\nconsole.log(proxyObj.x); // 100 (number)",
  },
  {
    id: 112,
    lessonId: 3,
    content:
      "正規表現で、半角数字のみで構成される文字列かどうかを判定してください。",
    template: "// ① 定数\nconst str = '12345';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "半角数字のみ判定",
    example: "引数: '12345' => true, '12a45' => false",
    exampleAnswer:
      "const isOnlyDigits = s => /^\\d+$/.test(s);\nconst str = '12345';\nconsole.log(isOnlyDigits(str)); // true",
  },
  {
    id: 113,
    lessonId: 3,
    content:
      "正規表現で、電話番号（例: 090-1234-5678 など）っぽい書式を検出して返してください。",
    template:
      "// ① 定数\nconst str = '連絡先: 090-1234-5678, 03-1234-5678';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "電話番号らしき検出",
    example:
      "引数: '連絡先: 090-1234-5678, 03-1234-5678' => ['090-1234-5678','03-1234-5678']",
    exampleAnswer:
      "const extractPhones = s => {\n  const pattern = /\\b\\d{2,4}-\\d{2,4}-\\d{4}\\b/g;\n  return s.match(pattern)||[];\n};\nconst str = '連絡先: 090-1234-5678, 03-1234-5678';\nconsole.log(extractPhones(str));",
  },
  {
    id: 114,
    lessonId: 3,
    content:
      "ジェネレーターを使って、木構造を深さ優先で巡回するイテレーターを実装してください。",
    template:
      "// ① 定数\nconst tree = {\n  val:'root',\n  children:[\n    {val:'child1', children:[]},\n    {val:'child2', children:[\n      {val:'grandchild', children:[]}\n    ]}\n  ]\n};\n\n// ② 関数定義\n\n// ③ 実行",
    title: "木構造のDFSジェネレータ",
    example: "root -> child1 -> child2 -> grandchild の順にyield",
    exampleAnswer:
      "function* dfs(node){\n  yield node.val;\n  for(const c of node.children){\n    yield* dfs(c);\n  }\n}\n\nconst tree = {\n  val:'root',\n  children:[\n    {val:'child1', children:[]},\n    {val:'child2', children:[\n      {val:'grandchild', children:[]}\n    ]}\n  ]\n};\n\nfor(const value of dfs(tree)){\n  console.log(value);\n}",
  },
  {
    id: 115,
    lessonId: 3,
    content:
      "BigIntを使って、大きな数同士の掛け算を正確に計算する関数を作成してください。",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "BigIntで大きな数の計算",
    example: "999999999999999999n * 2n => 1999999999999999998n",
    exampleAnswer:
      "const bigMultiply = (a,b) => a * b;\nconst a = 999999999999999999n;\nconst b = 2n;\nconsole.log(bigMultiply(a,b)); // 1999999999999999998n",
  },
  {
    id: 116,
    lessonId: 3,
    content:
      "Intl APIを使って、指定したロケールと通貨でフォーマットされた価格文字列を返してください。",
    template:
      "// ① 定数\nconst price = 1234567;\nconst locale = 'ja-JP';\nconst currency = 'JPY';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "Intlで通貨フォーマット",
    example:
      "引数: price=1234567, locale='ja-JP', currency='JPY' => '￥1,234,567'",
    exampleAnswer:
      "const formatCurrency = (value, locale, currency) => {\n  return new Intl.NumberFormat(locale,{style:'currency',currency}).format(value);\n};\nconst price = 1234567;\nconsole.log(formatCurrency(price,'ja-JP','JPY')); // '￥1,234,567'",
  },
  {
    id: 117,
    lessonId: 3,
    content:
      "Temporal(提案中) のような日付操作ライブラリを想定し、日付の加算/減算を行う関数を作成してください。（簡易実装可）",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "日付加算/減算（仮）",
    example: "『2025-01-01』 に 10日足す => 『2025-01-11』",
    exampleAnswer:
      "const addDays = (dateStr, days) => {\n  const d = new Date(dateStr);\n  d.setDate(d.getDate()+days);\n  return d.toISOString().split('T')[0];\n};\n\nconsole.log(addDays('2025-01-01', 10)); // 2025-01-11",
  },
  {
    id: 118,
    lessonId: 3,
    content:
      "正規表現を使って、ユーザー名@ドメイン の形式をバリデーションし、ユーザー名は英数字のみ、ドメインは英字のみ許可してください。",
    template:
      "// ① 定数\nconst email = 'user123@domain';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "独自メール書式バリデーション",
    example: "引数: 'user123@domain' => true, 'user@dom123' => false",
    exampleAnswer:
      "const validateCustomEmail = s => /^[a-zA-Z0-9]+@[a-zA-Z]+$/.test(s);\nconst email = 'user123@domain';\nconsole.log(validateCustomEmail(email)); // true",
  },
  {
    id: 119,
    lessonId: 3,
    content:
      "Setを使って、2つの配列の差集合(片方にのみ存在する要素)を返してください。",
    template:
      "// ① 定数\nconst arr1 = [1,2,3];\nconst arr2 = [2,3,4];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "差集合",
    example: "引数: [1,2,3],[2,3,4] => [1,4] (順不同)",
    exampleAnswer:
      "const difference = (a1,a2) => {\n  const s1 = new Set(a1);\n  const s2 = new Set(a2);\n  return [...a1.filter(x=>!s2.has(x)), ...a2.filter(x=>!s1.has(x))];\n};\nconst arr1 = [1,2,3];\nconst arr2 = [2,3,4];\nconsole.log(difference(arr1,arr2)); // [1,4]",
  },
  {
    id: 120,
    lessonId: 3,
    content:
      "Mapを使って、オブジェクトキーでは使えない型（例:オブジェクトや配列）をキーにして値を管理するデモ関数を作成してください。",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "Mapで複合型キー",
    example: "オブジェクトや配列をキーに .get() で値を取得できる",
    exampleAnswer:
      "const demoMapKeys = () => {\n  const m = new Map();\n  const keyObj = {x:1};\n  const keyArr = [1,2];\n  m.set(keyObj, 'objectValue');\n  m.set(keyArr, 'arrayValue');\n  console.log(m.get(keyObj)); // objectValue\n  console.log(m.get(keyArr)); // arrayValue\n};\n\ndemoMapKeys();",
  },
  {
    id: 121,
    lessonId: 3,
    content:
      "WeakMapを使って、あるオブジェクトに追加情報を付与しつつ、オブジェクトが破棄されたらGCされる仕組みを実演してください。（コメントで説明）",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "WeakMapで追加情報",
    example: "オブジェクト参照がなくなればGC対象になる例",
    exampleAnswer:
      "const demoWeakMap = () => {\n  const wm = new WeakMap();\n  let obj = {name:'test'};\n  wm.set(obj, {extra:'metadata'});\n  console.log(wm.get(obj)); // {extra:'metadata'}\n  // objへの参照を削除すると、WeakMapのキーとしてのobjもGCされる可能性がある\n  obj = null;\n  // ここでGCされれば、wm内のデータも消える（厳密なタイミングは不定）\n};\n\ndemoWeakMap();",
  },
  {
    id: 122,
    lessonId: 3,
    content:
      "非同期ジェネレータを使い、外部ソースから一定間隔でデータを取得するイテレーターを作成してください。（モック可）",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "非同期ジェネレータで定期取得",
    example: "1秒ごとにデータをyield、3回で終了",
    exampleAnswer:
      "async function* fetchDataTimes(times){\n  for(let i=0;i<times;i++){\n    await new Promise(res=>setTimeout(res,1000));\n    yield `data-${i}`;\n  }\n}\n\n(async ()=>{\n  for await(const d of fetchDataTimes(3)){\n    console.log(d);\n  }\n})();",
  },
  {
    id: 123,
    lessonId: 3,
    content:
      "Object.definePropertyを使って、オブジェクトの特定プロパティを読み取り専用に設定してください。",
    template:
      "// ① 定数\nconst obj = {x:1};\n\n// ② 関数 or 直接設定\n\n// ③ 実行例",
    title: "definePropertyで読み取り専用",
    example: "obj.x を書き換えても変わらない",
    exampleAnswer:
      "Object.defineProperty(obj, 'x', {\n  writable: false,\n  configurable: false\n});\nobj.x = 999;\nconsole.log(obj.x); // 1",
  },
  {
    id: 124,
    lessonId: 3,
    content:
      "オブジェクトを受け取り、プロトタイプチェーン上にあるすべてのプロパティ名を列挙して配列にして返してください。",
    template:
      "// ① 定数\nconst obj = Object.create({p:1});\nobj.x = 10;\nobj.y = 20;\n\n// ② 関数定義\n\n// ③ 実行",
    title: "プロトタイプチェーン上のプロパティ列挙",
    example: "obj が {x,y}、プロトタイプが {p} => ['x','y','p'] (順不同)",
    exampleAnswer:
      "const listAllProps = o => {\n  let props=[];\n  for(const key in o){\n    props.push(key);\n  }\n  return props;\n};\n\nconst obj = Object.create({p:1});\nobj.x=10;\nobj.y=20;\nconsole.log(listAllProps(obj)); // ['x','y','p']",
  },
  {
    id: 125,
    lessonId: 3,
    content:
      "クラス構文を使って、静的メソッドとインスタンスメソッドを持つ簡単な例を作成してください。",
    template: "// ① クラス定義\n\n// ② 実行例",
    title: "クラス構文（静的メソッド）",
    example: "MyClass.staticMethod(), new MyClass().instanceMethod()",
    exampleAnswer:
      "class MyClass {\n  static greet(){\n    return 'Hello from static';\n  }\n  instanceMethod(){\n    return 'Hello from instance';\n  }\n}\n\nconsole.log(MyClass.greet());\nconsole.log(new MyClass().instanceMethod());",
  },
  {
    id: 126,
    lessonId: 3,
    content:
      "クラスの継承を使い、親クラスのコンストラクタをsuperで呼び出す例を作成してください。",
    template: "// ① クラス定義\n\n// ② 実行例",
    title: "クラスの継承とsuper",
    example: "ChildクラスがParentクラスを継承する",
    exampleAnswer:
      "class Parent {\n  constructor(name){\n    this.name = name;\n  }\n  greet(){\n    return `Hello, ${this.name}`;\n  }\n}\n\nclass Child extends Parent {\n  constructor(name, age){\n    super(name);\n    this.age = age;\n  }\n}\n\nconst c = new Child('Taro',20);\nconsole.log(c.greet()); // Hello, Taro\nconsole.log(c.age); // 20",
  },
  {
    id: 127,
    lessonId: 3,
    content:
      "Symbolを使って、他からアクセスされにくい(衝突しない)オブジェクトプロパティを定義してください。",
    template:
      "// ① 定数\nconst secretKey = Symbol('secret');\nconst obj = {};\n\n// ② 設定\n\n// ③ 実行例",
    title: "Symbolプロパティ",
    example: "obj[secretKey] = 'hidden' => Object.keysで列挙されない",
    exampleAnswer:
      "const secretKey = Symbol('secret');\nconst obj = {};\nobj[secretKey] = 'hiddenValue';\n\nconsole.log(obj[secretKey]); // hiddenValue\nconsole.log(Object.keys(obj)); // []",
  },
  {
    id: 128,
    lessonId: 3,
    content:
      "async/await と Promise.allSettled を組み合わせて、複数の非同期処理が成功/失敗含めて全て完了後に結果をまとめて表示してください。",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "Promise.allSettled + async/await",
    example: "成功/失敗を含む結果一覧を取得",
    exampleAnswer:
      "const asyncTask = (val, fail=false) => new Promise((res,rej)=>{\n  setTimeout(()=> fail? rej('Error') : res(val), 200);\n});\n\nconst runAllSettled = async () => {\n  const results = await Promise.allSettled([\n    asyncTask('ok1'),\n    asyncTask('ng', true),\n    asyncTask('ok2')\n  ]);\n  console.log(results);\n};\n\nrunAllSettled();",
  },
  {
    id: 129,
    lessonId: 3,
    content:
      "ArrayBufferとTypedArray(Uint8Arrayなど)を使って、バイナリデータを生成・操作する例を作成してください。",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "ArrayBufferでバイナリ操作",
    example: "Uint8Arrayで 0xFF,0x01 を設定して読み出す",
    exampleAnswer:
      "const demoBinary = () => {\n  const buffer = new ArrayBuffer(2);\n  const view = new Uint8Array(buffer);\n  view[0] = 0xFF;\n  view[1] = 0x01;\n  console.log(view[0].toString(16), view[1].toString(16)); // ff 1\n};\n\ndemoBinary();",
  },
  {
    id: 130,
    lessonId: 3,
    content:
      "非同期イテレーター(for-await-of)とジェネレータを使って、ファイルの行を1行ずつ読むような処理を模擬してください。（実際のI/O不要）",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "非同期イテレーターで行読み込み",
    example: "モックで 3行のデータを1秒間隔でyield",
    exampleAnswer:
      "async function* lineReaderMock(){\n  const lines = ['line1','line2','line3'];\n  for(const ln of lines){\n    await new Promise(res=>setTimeout(res,1000));\n    yield ln;\n  }\n}\n\n(async ()=>{\n  for await(const line of lineReaderMock()){\n    console.log(line);\n  }\n})();",
  },
  {
    id: 131,
    lessonId: 3,
    content:
      "正規表現のグループ名(?<name>...)を使い、複数の部分を抽出してオブジェクトとして返してください。",
    template:
      "// ① 定数\nconst str = 'Name: Taro, Age: 20';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "名前付きキャプチャ",
    example: "引数: 'Name: Taro, Age: 20' => {name:'Taro', age:'20'}",
    exampleAnswer:
      "const parseData = s => {\n  const pattern = /Name:\\s(?<name>\\w+),\\sAge:\\s(?<age>\\d+)/;\n  const match = s.match(pattern);\n  if(!match) return null;\n  return {name: match.groups.name, age: match.groups.age};\n};\n\nconst str = 'Name: Taro, Age: 20';\nconsole.log(parseData(str)); // {name:'Taro', age:'20'}",
  },
  {
    id: 132,
    lessonId: 3,
    content:
      "Web Worker を想定し、メインスレッドから重い処理をWorkerにオフロードする仕組みをモックで作成してください。（実際のWorker不要）",
    template: "// ① 関数 or クラス定義\n\n// ② 実行例",
    title: "WebWorkerモック",
    example: "worker.postMessage({task:'heavy'}) => setTimeoutで結果を返す",
    exampleAnswer:
      "class MockWorker {\n  constructor(){\n    this.onmessage = null;\n  }\n  postMessage(msg){\n    setTimeout(()=>{\n      if(this.onmessage){\n        this.onmessage({data:`done: ${msg.task}`});\n      }\n    },500);\n  }\n}\n\nconst worker = new MockWorker();\nworker.onmessage = e => console.log(e.data);\nworker.postMessage({task:'heavy'});",
  },
  {
    id: 133,
    lessonId: 3,
    content:
      "デコレーター（実験的）を想定し、クラスメソッドにログ出力の機能を追加する例を示してください。（モックで可）",
    template: "// ① デコレーター関数\n\n// ② クラス定義\n\n// ③ 実行例",
    title: "メソッドデコレーター",
    example: "@logMethod で呼び出し前後にログを出す例",
    exampleAnswer:
      "// JSデコレーターは実験的機能。モック例\nfunction logMethod(target, name, descriptor){\n  const original = descriptor.value;\n  descriptor.value = function(...args){\n    console.log(`Calling ${name} with`, args);\n    const result = original.apply(this,args);\n    console.log(`Result of ${name}:`, result);\n    return result;\n  };\n  return descriptor;\n}\n\nclass Example {\n  @logMethod\n  add(a,b){\n    return a+b;\n  }\n}\n\nconst ex = new Example();\nex.add(2,3);",
  },
  {
    id: 134,
    lessonId: 3,
    content:
      "非同期の再帰処理：ある数値nから1まで1秒ごとにカウントダウンしつつ、終了時に'終わり'と表示してください。",
    template: "// ① 関数定義\n\n// ② 実行",
    title: "非同期再帰カウントダウン",
    example: "n=3 => 3 -> 2 -> 1 -> '終わり'",
    exampleAnswer:
      "const asyncCountdown = async n => {\n  if(n===0){\n    console.log('終わり');\n    return;\n  }\n  console.log(n);\n  await new Promise(res=>setTimeout(res,1000));\n  return asyncCountdown(n-1);\n};\n\nasyncCountdown(3);",
  },
  {
    id: 135,
    lessonId: 3,
    content:
      "IntersectionObserverを想定し、要素が可視領域に入ったらコールバックを呼び出す仕組みをモックで作ってください。",
    template: "// ① 関数 or クラス定義\n\n// ② 実行例",
    title: "IntersectionObserverモック",
    example: "targetが可視領域に入ったと想定してコールバックを発火",
    exampleAnswer:
      "class MockIntersectionObserver {\n  constructor(callback, options){\n    this.callback = callback;\n    this.options = options;\n  }\n  observe(element){\n    // 即時に可視と仮定してコールバック\n    this.callback([{target:element, isIntersecting:true}], this);\n  }\n  unobserve(){/* no-op */}\n}\n\n// 使用例\nconst io = new MockIntersectionObserver((entries)=>{\n  entries.forEach(e=>{\n    if(e.isIntersecting){\n      console.log('element is visible:', e.target);\n    }\n  });\n});\nio.observe('dummyElement');",
  },
  {
    id: 136,
    lessonId: 3,
    content:
      "SharedArrayBufferを想定し、マルチスレッド（モック）で同じバッファを共有してデータを操作する例を作成してください。",
    template: "// ① 関数定義\n\n// ② 実行例",
    title: "SharedArrayBufferで共有",
    example: "メインスレッドが書き込み、ワーカーが読み込む",
    exampleAnswer:
      "// モック実装\nconst sharedBuffer = new SharedArrayBuffer(4);\nconst view = new Int32Array(sharedBuffer);\n\nconst mainThread = () => {\n  view[0] = 100;\n  console.log('Main wrote 100');\n};\n\nconst workerThread = () => {\n  // ここでは既に 100 が書き込まれている想定\n  console.log('Worker sees:', view[0]);\n};\n\nmainThread();\nworkerThread();",
  },
  {
    id: 137,
    lessonId: 3,
    content:
      "アルゴリズム: KMP法(文字列検索)を実装し、テキスト中からパターンの開始インデックスを返してください。見つからない場合-1。",
    template:
      "// ① 定数\nconst text = 'abxabxabxabxaby';\nconst pattern = 'abxaby';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "KMP文字列検索",
    example: "引数: text='abxabxabxabxaby', pattern='abxaby' => 8",
    exampleAnswer:
      "const kmpSearch = (text, pattern) => {\n  const lps = buildLPS(pattern);\n  let i=0,j=0;\n  while(i<text.length){\n    if(text[i]===pattern[j]){\n      i++; j++;\n      if(j===pattern.length) return i-j;\n    } else {\n      if(j>0) j=lps[j-1];\n      else i++;\n    }\n  }\n  return -1;\n};\n\nfunction buildLPS(p){\n  const lps = [0];\n  let prefixLen=0; let i=1;\n  while(i<p.length){\n    if(p[i]===p[prefixLen]){\n      prefixLen++;\n      lps[i]=prefixLen;\n      i++;\n    } else {\n      if(prefixLen>0) prefixLen=lps[prefixLen-1];\n      else {\n        lps[i]=0;\n        i++;\n      }\n    }\n  }\n  return lps;\n}\n\nconst text = 'abxabxabxabxaby';\nconst pattern = 'abxaby';\nconsole.log(kmpSearch(text, pattern)); // 8",
  },
  {
    id: 138,
    lessonId: 3,
    content:
      "アルゴリズム: トライ木(Trie)を実装し、insertとsearchを行う関数を用意してください。",
    template: "// ① クラス or 関数定義\n\n// ② 実行例",
    title: "Trie木",
    example: "insert('apple'), search('apple') => true",
    exampleAnswer:
      "class TrieNode {\n  constructor(){\n    this.children = {};\n    this.end = false;\n  }\n}\n\nclass Trie {\n  constructor(){\n    this.root = new TrieNode();\n  }\n  insert(word){\n    let node = this.root;\n    for(const ch of word){\n      if(!node.children[ch]){\n        node.children[ch] = new TrieNode();\n      }\n      node = node.children[ch];\n    }\n    node.end = true;\n  }\n  search(word){\n    let node = this.root;\n    for(const ch of word){\n      if(!node.children[ch]) return false;\n      node = node.children[ch];\n    }\n    return node.end;\n  }\n}\n\nconst trie = new Trie();\ntrie.insert('apple');\nconsole.log(trie.search('apple')); // true\nconsole.log(trie.search('app')); // false",
  },
  {
    id: 139,
    lessonId: 3,
    content:
      "アルゴリズム: グラフ探索でBFSを使って最短経路を探索し、その経路を配列で返してください。（無重み）",
    template:
      "// ① 定数\nconst graph = {\n  A:['B','C'],\n  B:['D'],\n  C:['D','E'],\n  D:['F'],\n  E:['F'],\n  F:[]\n};\nconst start = 'A';\nconst goal = 'F';\n\n// ② 関数定義\n\n// ③ 実行",
    title: "BFSによる最短経路",
    example: "A->C->E->F または A->C->D->F など同じ距離ならどちらでもOK",
    exampleAnswer:
      "const bfsShortestPath = (g, start, goal) => {\n  const queue = [[start]];\n  const visited = new Set([start]);\n\n  while(queue.length){\n    const path = queue.shift();\n    const node = path[path.length-1];\n    if(node === goal) return path;\n    for(const next of g[node]){\n      if(!visited.has(next)){\n        visited.add(next);\n        queue.push([...path, next]);\n      }\n    }\n  }\n  return null;\n};\n\nconst graph = {\n  A:['B','C'],\n  B:['D'],\n  C:['D','E'],\n  D:['F'],\n  E:['F'],\n  F:[]\n};\nconsole.log(bfsShortestPath(graph,'A','F'));",
  },
  {
    id: 140,
    lessonId: 3,
    content:
      "アルゴリズム: Dijkstra法(頂点に非負重み)を使ってグラフの最短距離を求めてください。",
    template:
      "// ① 定数\nconst graph = {\n  A: {B:2, C:4},\n  B: {C:1, D:7},\n  C: {E:3},\n  D: {F:1},\n  E: {D:2, F:5},\n  F: {}\n};\n\n// ② 関数定義\n\n// ③ 実行",
    title: "Dijkstra最短経路",
    example: "A->B->C->E->D->F のように進む経路が最短",
    exampleAnswer:
      "const dijkstra = (graph, start, end) => {\n  const distances = {};\n  const visited = new Set();\n  for(const node in graph){\n    distances[node] = Infinity;\n  }\n  distances[start] = 0;\n\n  const findMinNode = () => {\n    let minNode=null;\n    let minDist=Infinity;\n    for(const node in distances){\n      if(!visited.has(node) && distances[node]<minDist){\n        minDist=distances[node];\n        minNode=node;\n      }\n    }\n    return minNode;\n  };\n\n  let current = findMinNode();\n  while(current){\n    const distCurrent = distances[current];\n    for(const neighbor in graph[current]){\n      const newDist = distCurrent + graph[current][neighbor];\n      if(newDist < distances[neighbor]){\n        distances[neighbor] = newDist;\n      }\n    }\n    visited.add(current);\n    current = findMinNode();\n  }\n  return distances[end];\n};\n\nconst graph = {\n  A: {B:2, C:4},\n  B: {C:1, D:7},\n  C: {E:3},\n  D: {F:1},\n  E: {D:2, F:5},\n  F: {}\n};\n\nconsole.log(dijkstra(graph,'A','F'));",
  },
  {
    id: 141,
    lessonId: 3,
    content:
      "アルゴリズム: DFSを用いて有向グラフにおけるトポロジカルソートを実装してください。",
    template:
      "// ① 定数\nconst graph = {\n  A:['B','C'],\n  B:['D'],\n  C:['D','E'],\n  D:['F'],\n  E:['F'],\n  F:[]\n};\n\n// ② 関数定義\n\n// ③ 実行",
    title: "トポロジカルソート",
    example: "A->B->D->F, A->C->E->F の順序を満たす並び",
    exampleAnswer:
      "const topologicalSort = g => {\n  const visited = new Set();\n  const stack = [];\n  const dfs = node => {\n    visited.add(node);\n    for(const nxt of g[node]){\n      if(!visited.has(nxt)) dfs(nxt);\n    }\n    stack.push(node);\n  };\n  for(const node in g){\n    if(!visited.has(node)) dfs(node);\n  }\n  return stack.reverse();\n};\n\nconst graph = {\n  A:['B','C'],\n  B:['D'],\n  C:['D','E'],\n  D:['F'],\n  E:['F'],\n  F:[]\n};\nconsole.log(topologicalSort(graph));",
  },
  {
    id: 142,
    lessonId: 3,
    content:
      "アルゴリズム: Union-Find(Disjoint Set)構造を実装し、要素を同じグループにまとめたり、連結かどうかを判定してください。",
    template: "// ① クラス定義\n\n// ② 実行例",
    title: "Union-Find構造",
    example: "union(1,2), union(2,3) => isConnected(1,3)=true",
    exampleAnswer:
      "class UnionFind {\n  constructor(n){\n    this.parent = [...Array(n).keys()];\n    this.rank = Array(n).fill(0);\n  }\n\n  find(x){\n    if(this.parent[x]===x) return x;\n    this.parent[x] = this.find(this.parent[x]);\n    return this.parent[x];\n  }\n\n  union(a,b){\n    const ra = this.find(a);\n    const rb = this.find(b);\n    if(ra!==rb){\n      if(this.rank[ra]<this.rank[rb]){\n        this.parent[ra]=rb;\n      } else if(this.rank[ra]>this.rank[rb]){\n        this.parent[rb]=ra;\n      } else {\n        this.parent[rb]=ra;\n        this.rank[ra]++;\n      }\n    }\n  }\n\n  isConnected(a,b){\n    return this.find(a)===this.find(b);\n  }\n}\n\nconst uf = new UnionFind(5);\nuf.union(0,1);\nuf.union(1,2);\nconsole.log(uf.isConnected(0,2)); // true\nconsole.log(uf.isConnected(0,3)); // false",
  },
  {
    id: 143,
    lessonId: 3,
    content:
      "アルゴリズム: Bitmaskを使って、部分集合を全列挙する関数を実装してください。配列の全組み合わせを返す。",
    template:
      "// ① 定数\nconst arr = ['a','b','c'];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "Bitmaskで部分集合列挙",
    example: "引数: ['a','b','c'] => [[],['a'],['b'],['a','b'],['c'],...]",
    exampleAnswer:
      "const enumerateSubsets = arr => {\n  const res=[];\n  const n=arr.length;\n  for(let mask=0; mask<(1<<n); mask++){\n    const subset=[];\n    for(let i=0;i<n;i++){\n      if(mask & (1<<i)) subset.push(arr[i]);\n    }\n    res.push(subset);\n  }\n  return res;\n};\n\nconst arr = ['a','b','c'];\nconsole.log(enumerateSubsets(arr));",
  },
  {
    id: 144,
    lessonId: 3,
    content:
      "非同期処理: スロットル関数を実装し、指定時間内は呼び出しを無視して最後に1度だけ実行されるようにしてください。",
    template: "// ① 関数定義\n\n// ② 実行例",
    title: "throttle実装",
    example: "setIntervalで多発する処理を指定間隔に間引く",
    exampleAnswer:
      "const throttle = (fn, wait) => {\n  let timer=null;\n  let lastArgs=null;\n\n  const invoke = ()=>{\n    if(lastArgs){\n      fn(...lastArgs);\n      lastArgs=null;\n      timer=setTimeout(invoke, wait);\n    } else {\n      timer=null;\n    }\n  };\n\n  return (...args)=>{\n    if(!timer){\n      fn(...args);\n      timer=setTimeout(invoke, wait);\n    } else {\n      lastArgs=args;\n    }\n  };\n};\n\n// 使用例\nconst throttled = throttle((msg)=>console.log(msg),1000);\n\nlet count=0;\nconst iv = setInterval(()=>{\n  count++;\n  throttled('called '+count);\n  if(count>5) clearInterval(iv);\n},200);",
  },
  {
    id: 145,
    lessonId: 3,
    content:
      "非同期処理: デバウンス関数を実装し、連続呼び出しが止まってから一定時間後に実行されるようにしてください。",
    template: "// ① 関数定義\n\n// ② 実行例",
    title: "debounce実装",
    example: "入力イベントが停止してから500ms後に処理を行う",
    exampleAnswer:
      "const debounce = (fn, wait) => {\n  let timer=null;\n  return (...args)=>{\n    clearTimeout(timer);\n    timer=setTimeout(()=>fn(...args), wait);\n  };\n};\n\n// 使用例\nconst debounced = debounce((msg)=>console.log(msg),500);\n\ndebounced('Hello');\nsetTimeout(()=>debounced('World'), 300);\nsetTimeout(()=>debounced('Again'), 600);\n// 最後の呼び出しから500ms後に実行",
  },
  {
    id: 146,
    lessonId: 3,
    content:
      "WebAssemblyを想定し、wasmのバイナリをロードしてエクスポートされた関数を呼び出す流れをモックで作成してください。",
    template: "// ① 関数 or クラス定義\n\n// ② 実行例",
    title: "WebAssemblyロードモック",
    example: "fetchして WebAssembly.instantiate する流れを仮定",
    exampleAnswer:
      "const mockWasmLoad = async (binary) => {\n  // 実際には WebAssembly.instantiate(binary) など\n  return { instance:{ exports:{ add:(a,b)=>a+b }}};\n};\n\n(async ()=>{\n  const wasmModule = await mockWasmLoad('dummyBinary');\n  console.log(wasmModule.instance.exports.add(2,3)); // 5\n})();",
  },
  {
    id: 147,
    lessonId: 3,
    content:
      "アルゴリズム: A*探索で、グリッドマップ上のスタートからゴールまでの推定最短経路を見つけてください（ヒューリスティックはマンハッタン距離）。",
    template:
      "// ① 定数\nconst grid = [\n  [1,1,1],\n  [1,0,1],\n  [1,1,1]\n];\nconst start = [0,0], goal = [2,2];\n\n// ② 関数定義\n\n// ③ 実行",
    title: "A*探索",
    example: "障害物(0)を避けて最短経路",
    exampleAnswer:
      "const aStar = (grid, start, goal) => {\n  const rows=grid.length, cols=grid[0].length;\n\n  const h = (r,c) => {\n    // マンハッタン距離\n    return Math.abs(r-goal[0]) + Math.abs(c-goal[1]);\n  };\n\n  const openSet=[{pos:start, g:0, f:h(...start), parent:null}];\n  const closedSet=[];\n\n  const getNeighbors = ([r,c])=>{\n    const dirs=[[1,0],[-1,0],[0,1],[0,-1]];\n    return dirs.map(([dr,dc])=>[r+dr,c+dc])\n               .filter(([nr,nc])=> nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc]===1);\n  };\n\n  const getNode=(list,pos)=> list.find(n=>n.pos[0]===pos[0] && n.pos[1]===pos[1]);\n\n  while(openSet.length){\n    // f値が最小のノードを取り出す\n    openSet.sort((a,b)=>a.f-b.f);\n    const current = openSet.shift();\n    if(current.pos[0]===goal[0] && current.pos[1]===goal[1]){\n      // 経路再構築\n      const path=[];\n      let temp=current;\n      while(temp){\n        path.push(temp.pos);\n        temp=temp.parent;\n      }\n      return path.reverse();\n    }\n    closedSet.push(current);\n\n    for(const neighbor of getNeighbors(current.pos)){\n      if(getNode(closedSet, neighbor)) continue;\n      const tentativeG = current.g+1;\n      let neighborNode = getNode(openSet, neighbor);\n      if(!neighborNode){\n        neighborNode = {\n          pos: neighbor,\n          g: tentativeG,\n          f: tentativeG + h(...neighbor),\n          parent: current\n        };\n        openSet.push(neighborNode);\n      } else if(tentativeG < neighborNode.g){\n        neighborNode.g=tentativeG;\n        neighborNode.f=tentativeG + h(...neighbor);\n        neighborNode.parent=current;\n      }\n    }\n  }\n  return null;\n};\n\nconst grid = [\n  [1,1,1],\n  [1,0,1],\n  [1,1,1]\n];\nconsole.log(aStar(grid,[0,0],[2,2]));",
  },
  {
    id: 148,
    lessonId: 3,
    content:
      "アルゴリズム: ゲーム木探索を想定し、Minimaxアルゴリズムを簡単に実装してください。",
    template: "// ① 関数定義\n\n// ② 実行例 (ツリーを仮定)",
    title: "Minimax法",
    example: "二人零和ゲームでのスコアを再帰的に計算",
    exampleAnswer:
      "const minimax = (node, depth, isMaximizing) => {\n  // nodeがリーフならnode.valueを返す\n  if(node.children.length===0) return node.value;\n\n  if(isMaximizing){\n    let best=-Infinity;\n    for(const child of node.children){\n      const val = minimax(child, depth+1, false);\n      best=Math.max(best,val);\n    }\n    return best;\n  } else {\n    let best=Infinity;\n    for(const child of node.children){\n      const val = minimax(child, depth+1, true);\n      best=Math.min(best,val);\n    }\n    return best;\n  }\n};\n\n// 実行例\nconst tree = {\n  value:null,\n  children:[\n    {value:null, children:[\n      {value:3,children:[]},\n      {value:5,children:[]}\n    ]},\n    {value:null, children:[\n      {value:2,children:[]},\n      {value:9,children:[]}\n    ]}\n  ]\n};\n\nconsole.log(minimax(tree,0,true)); // 3 など",
  },
  {
    id: 149,
    lessonId: 3,
    content:
      "アルゴリズム: LRUキャッシュ(Least Recently Used)を実装し、容量を超えた場合は古いキーを削除してください。",
    template: "// ① クラス定義\n\n// ② 実行例",
    title: "LRUキャッシュ",
    example:
      "容量が2のキャッシュで lru.put('a',1), lru.put('b',2), lru.get('a'), lru.put('c',3) => 'b'が削除",
    exampleAnswer:
      "class LRUCache {\n  constructor(capacity){\n    this.capacity=capacity;\n    this.map=new Map();\n  }\n  get(key){\n    if(!this.map.has(key)) return null;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key,val);\n    return val;\n  }\n  put(key,val){\n    if(this.map.has(key)){\n      this.map.delete(key);\n    }\n    this.map.set(key,val);\n    if(this.map.size>this.capacity){\n      const firstKey=this.map.keys().next().value;\n      this.map.delete(firstKey);\n    }\n  }\n}\n\n// 使用例\nconst lru = new LRUCache(2);\nlru.put('a',1);\nlru.put('b',2);\nconsole.log(lru.get('a')); // 1 (使われたので更新)\nlru.put('c',3); // 'b'が削除される\nconsole.log(lru.get('b')); // null",
  },
  {
    id: 150,
    lessonId: 3,
    content:
      "アルゴリズム: バックトラックを使ってN皇后問題を解き、すべての解の配置（クイーンの位置）を返してください。",
    template: "// ① 関数定義\n\n// ② 実行例",
    title: "N-Queens",
    example: "n=4 => 全解を返す",
    exampleAnswer:
      "const solveNQueens = n => {\n  const results=[];\n  const board = Array(n).fill(-1);\n\n  const isSafe = (row,col) => {\n    for(let r=0; r<row; r++){\n      const c=board[r];\n      if(c===col || Math.abs(row-r)===Math.abs(col-c)) return false;\n    }\n    return true;\n  };\n\n  const backtrack = (row) => {\n    if(row===n){\n      results.push([...board]);\n      return;\n    }\n    for(let col=0; col<n; col++){\n      if(isSafe(row,col)){\n        board[row]=col;\n        backtrack(row+1);\n        board[row]=-1;\n      }\n    }\n  };\n\n  backtrack(0);\n  return results;\n};\n\nconsole.log(solveNQueens(4));",
  },
];

export const questions = [
  ...lesson1Questions,
  ...lesson2Questions,
  ...lesson3Questions,
];
