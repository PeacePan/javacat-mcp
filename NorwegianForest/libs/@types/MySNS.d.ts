/** 後端 SNS 結構，message 由於使用到 sdk 型別，故先給 string */
export type SNSMessage = {
	eventType: string;
	content: {
		Id: string;
		Message: string;
		MessageDeduplicationId: string;
		MessageGroupId: string;
	};
};
