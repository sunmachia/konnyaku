/**
 * こんにゃくクレープ アンケート送信API
 *
 * 使い方:
 * 1. 回答を保存したいGoogleスプレッドシートを開く
 * 2. 「拡張機能」→「Apps Script」を開く
 * 3. このファイルの内容を Code.gs に貼り付けて保存
 * 4. エディタで setup を1回実行し、権限を承認
 * 5. 「デプロイ」→「新しいデプロイ」→「ウェブアプリ」
 *    - 実行ユーザー: 自分
 *    - アクセスできるユーザー: 全員
 * 6. 発行されたURLを survey/index.html の GAS_ENDPOINT に貼り付ける
 */

var SHEET_NAME = 'responses';
var HEADERS = [
  '受信日時',
  '回答ID',
  '店舗',
  '商品',
  '総合評価',
  '味',
  '食感',
  '見た目',
  'また食べたい',
  'ひとこと',
  'アンケート版',
  'ページURL'
];

var SCORE_FIELDS = ['overall', 'taste', 'texture', 'appearance'];
var ALLOWED_SCORES = ['1', '2', '3', '4', '5'];
var ALLOWED_REPEAT = ['yes', 'maybe', 'no'];


/**
 * 最初に1回だけ実行してください。
 * シートと見出し行を作成します。
 */
function setup() {
  var sheet = getSheet_();
  formatSheet_(sheet);
  SpreadsheetApp.getUi().alert(
    '準備ができました。\n\n次に「デプロイ」→「新しいデプロイ」→「ウェブアプリ」で公開してください。'
  );
}


/**
 * ブラウザでWebアプリURLを開いたときの確認用ページ。
 */
function doGet() {
  var html = '<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width, initial-scale=1">'
    + '<meta name="robots" content="noindex">'
    + '<title>こんにゃくクレープ アンケートAPI</title>'
    + '<style>body{font-family:sans-serif;background:#faf8f3;color:#1f2a26;padding:32px;line-height:1.8}'
    + 'h1{font-size:20px}code{background:#eee;padding:2px 6px;border-radius:4px}</style></head><body>'
    + '<h1>こんにゃくクレープ アンケートAPI</h1>'
    + '<p>このURLは、アンケートの回答送信に使用しています。</p>'
    + '<p>回答はGoogleスプレッドシートの <code>' + SHEET_NAME + '</code> シートに保存されます。</p>'
    + '</body></html>';
  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


/**
 * アンケート画面からPOSTされた回答を保存します。
 */
function doPost(e) {
  var params = (e && e.parameter) || {};
  var requestId = String(params.requestId || '').slice(0, 64);

  try {
    // ボット対策: 画面に見えない項目が埋まっていたら、成功したように見せて保存しない
    if (String(params.website || '') !== '') {
      return postMessageResponse_('ok', requestId);
    }

    // 同じリクエストの再送は二重保存しない
    if (requestId && isDuplicate_(requestId)) {
      return postMessageResponse_('ok', requestId);
    }

    var data = validate_(params);
    appendResponse_(data);

    if (requestId) {
      try {
        CacheService.getScriptCache().put('req:' + requestId, '1', 21600);
      } catch (cacheError) {
        console.warn('CacheService error: ' + cacheError);
      }
    }

    return postMessageResponse_('ok', requestId);
  } catch (error) {
    console.error(error);
    return postMessageResponse_('error', requestId, '送信を完了できませんでした。');
  }
}


/**
 * 動作確認用。テスト行が1行追加されます。
 * 確認後、シートからテスト行を削除してください。
 */
function testDoPost() {
  var result = doPost({
    parameter: {
      store: 'test',
      product: 'konnyaku-crepe',
      overall: '5',
      taste: '5',
      texture: '5',
      appearance: '5',
      repeat: 'yes',
      comment: 'テスト送信です。',
      surveyVersion: 'test',
      requestId: 'test-' + Utilities.getUuid(),
      pageUrl: 'https://example.com/survey/'
    }
  });
  console.log(result.getContent());
}


function validate_(params) {
  var store = String(params.store || 'unknown').trim();
  var product = String(params.product || 'konnyaku-crepe').trim();
  var comment = String(params.comment || '').trim();
  var surveyVersion = String(params.surveyVersion || '').slice(0, 32);
  var pageUrl = String(params.pageUrl || '').slice(0, 500);

  if (!/^[a-zA-Z0-9_-]{0,32}$/.test(store)) {
    throw new Error('Invalid store: ' + store);
  }
  if (!/^[a-zA-Z0-9_-]{0,32}$/.test(product)) {
    throw new Error('Invalid product: ' + product);
  }

  var scores = {};
  SCORE_FIELDS.forEach(function (field) {
    var value = String(params[field] || '');
    if (ALLOWED_SCORES.indexOf(value) === -1) {
      throw new Error('Invalid score: ' + field + '=' + value);
    }
    scores[field] = Number(value);
  });

  var repeat = String(params.repeat || '');
  if (ALLOWED_REPEAT.indexOf(repeat) === -1) {
    throw new Error('Invalid repeat: ' + repeat);
  }

  return {
    store: store || 'unknown',
    product: product || 'konnyaku-crepe',
    overall: scores.overall,
    taste: scores.taste,
    texture: scores.texture,
    appearance: scores.appearance,
    repeat: repeat,
    comment: comment.slice(0, 300),
    surveyVersion: surveyVersion,
    pageUrl: pageUrl
  };
}


function appendResponse_(data) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      Utilities.getUuid(),
      data.store,
      data.product,
      data.overall,
      data.taste,
      data.texture,
      data.appearance,
      data.repeat,
      data.comment,
      data.surveyVersion,
      data.pageUrl
    ]);
  } finally {
    lock.releaseLock();
  }
}


function getSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error('このスクリプトはスプレッドシートに紐づけてください。');
  }

  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    formatSheet_(sheet);
  }

  return sheet;
}


function formatSheet_(sheet) {
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setFontWeight('bold')
    .setBackground('#2F5D4E')
    .setFontColor('#FFFFFF')
    .setVerticalAlignment('middle');

  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 36);

  sheet.getRange('A:A').setNumberFormat('yyyy/mm/dd hh:mm:ss');
  sheet.getRange('A:A').setHorizontalAlignment('left');
  sheet.getRange('E:I').setHorizontalAlignment('center');
  sheet.getRange('J:J').setWrap(true).setVerticalAlignment('top');
  sheet.getRange('L:L').setWrap(true).setVerticalAlignment('top');

  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 300);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 130);
  sheet.setColumnWidth(5, 80);
  sheet.setColumnWidth(6, 60);
  sheet.setColumnWidth(7, 60);
  sheet.setColumnWidth(8, 60);
  sheet.setColumnWidth(9, 90);
  sheet.setColumnWidth(10, 320);
  sheet.setColumnWidth(11, 100);
  sheet.setColumnWidth(12, 260);

  if (sheet.getLastRow() > 1 && !sheet.getFilter()) {
    sheet.getRange(1, 1, sheet.getLastRow(), HEADERS.length).createFilter();
  }
}


function isDuplicate_(requestId) {
  try {
    return CacheService.getScriptCache().get('req:' + requestId) !== null;
  } catch (error) {
    console.warn('CacheService error: ' + error);
    return false;
  }
}


function postMessageResponse_(status, requestId, message) {
  var payload = {
    type: 'konnyaku-survey',
    status: status,
    requestId: requestId || '',
    message: message || ''
  };

  var html = '<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width, initial-scale=1">'
    + '<meta name="robots" content="noindex">'
    + '<title>送信完了</title></head><body>'
    + '<p>送信が完了しました。この画面は閉じて構いません。</p>'
    + '<script>parent.postMessage(' + safeJson_(payload) + ', "*");</script>'
    + '</body></html>';

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


function safeJson_(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}
