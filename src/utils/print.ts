import moment from "moment";
import { StoreInfo } from "../interface/store";
import { TransactionItem } from "../interface/transaction";

const TEMPLATE = `<BR/>
<B><C>{{title}}</C></B>
<B><C>{{address}}</C></B>
<B><C>{{city}}</C></B>
<B><C>{{phone}}</C></B>
<BR/><IMG>""</IMG><BR/>
<L>{{date}}</L><R>{{time}}</R><BR/>
<BR/>
<B><C>Refund</C></B><BR/>
<BR/>
<L>Trans Number:</L><R>{{transNumber}}</R><BR/>
<L>Batch #:</L><R>{{batchNumber}}</R><BR/>
<BR/>
<L>{{cardBrand}}</L><R>Contactless</R><BR/>
<L>******{{cardCode}}</L><R>**/**</R><BR/>
<L>Reference Id:</L><R></R><BR/>
<BR/>
<L>Original Amount:</L><R>{{originalAmount}}</R><BR/>
<L>Refunded Amount:</L><R>{{refundedAmount}}</R><BR/>
<BR/>
<L>Resp:</L><R>APPROVED</R><BR/>
<L>Code:</L><R>{{authCode}}</R><BR/>
<L>Ref #:</L><R>{{rrn}}</R><BR/>
<BR/>
<L>App Name:</L><R>{{cardType}} {{cardBrand}}</R><BR/>
<L>AID:</L><R>{{aid}}</R><BR/>
<L>TVR:</L><R>{{tvr}}</R><BR/>
<L>TSI:</L><R>{{tsi}}</R><BR/>
<C>Cardholder acknowledges</C><BR/>
<C>receipt of goods and</C><BR/>
<C>obligations set forth</C><BR/>
<C>by the cardholder&apos;s</C><BR/>
<C>agreement with issuer.</C><BR/>`;

const generateRefundReceiptText = (transaction: TransactionItem, store: StoreInfo) => {
    const record: Record<string, string> = {
        title: store.name,
        address: store.storeInfo.address,
        city: `${store.storeInfo.city}, ${store.storeInfo.state}, ${store.storeInfo.zip}`,
        phone: store.contactInfo.phone,
        date: moment(transaction.created_at).format('yyyy/MM/DD'),
        time: moment(transaction.created_at).format('hh:mm:ss'),
        transNumber: transaction.transaction_id || '',
        batchNumber: transaction.detail?.batchNo || '',
        cardBrand: transaction.card_brand || '',
        cardCode: transaction.card_number,
        originalAmount: '$' + (transaction.detail?.totalAmount || ''),
        refundedAmount: '-$' + (Math.abs(transaction.amount) + '') || '',
        authCode: transaction.response_code,
        rrn: transaction.detail?.rrn || '',
        transId: transaction.detail?.transaction_id || '',
        cardType: transaction.card_type || '',
        aid: transaction.detail?.emvAID || '',
        tvr: transaction.detail?.emvTVR || '',
        tsi: transaction.detail?.emvTSI || '',
    };

    let result = TEMPLATE;
    for(const key in record) {
        result = result.replaceAll('{{' + key + '}}', record[key] || '');
    }

    return result;
}

export default generateRefundReceiptText;