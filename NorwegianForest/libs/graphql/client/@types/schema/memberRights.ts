import { TABLE_NAME } from '@norwegianForestTables/const';
import {
	AutoUpdateMemberClassBody,
	CrescLabSyncMemberBody,
	CrescLabSyncMemberLines,
	GivePointSettingBody,
	GivePointSettingLines,
	ImportPointBody,
	ImportPointLines,
	MemberAutoArchiveBody,
	MemberClassBody,
	MemberMergeBody,
	OCardSyncPointTaskBody,
	OCardSyncPointTaskLines,
	OCardSyncTaskBody,
	OCardSyncTaskLines,
	PetParkCouponAssignBody,
	PetParkCouponAssignLines,
	PetParkCouponBody,
	PetParkCouponEventBody,
	PetParkCouponEventLines,
	PetParkCouponExpirationBody,
	PetParkCouponExpirationLines,
	PointAccountBody,
	PointAccountLines,
	PointCardChangeArgs,
	PointDiscountBody,
	PointPromotionBody,
	PointPromotionLines,
} from '@norwegianForestTables/memberRights/_type';
import { SafeRecord2 } from '@norwegianForestTypes';
import { ExecuteDefineContent, NormalDefaultOperation, SchemaDefineContent } from '../';

export type MemberRightsTableRecordsSchemaDefine = {
	[TABLE_NAME.POINT_ACCOUNT]: SchemaDefineContent<SafeRecord2<PointAccountBody, PointAccountLines>, NormalDefaultOperation>;
	[TABLE_NAME.PET_PARK_COUPON_EVENT]: SchemaDefineContent<
		SafeRecord2<PetParkCouponEventBody, PetParkCouponEventLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.PET_PARK_COUPON_ASSIGN]: SchemaDefineContent<
		SafeRecord2<PetParkCouponAssignBody, PetParkCouponAssignLines>,
		NormalDefaultOperation,
		false,
		ExecuteDefineContent<'優惠券發放', SafeRecord2<PetParkCouponAssignBody, PetParkCouponAssignLines>, string>
	>;
	petparkcouponexpiration: SchemaDefineContent<
		SafeRecord2<PetParkCouponExpirationBody, PetParkCouponExpirationLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.PET_PARK_COUPON]: SchemaDefineContent<SafeRecord2<PetParkCouponBody>, NormalDefaultOperation>;
	[TABLE_NAME.MEMBER_CLASS]: SchemaDefineContent<SafeRecord2<MemberClassBody>, NormalDefaultOperation>;
	[TABLE_NAME.POINT_PROMOTION]: SchemaDefineContent<
		SafeRecord2<PointPromotionBody, PointPromotionLines>,
		NormalDefaultOperation,
		false,
		ExecuteDefineContent<'更新已兌換數量', never, string>
	>;
	[TABLE_NAME.POINT_DISCOUNT]: SchemaDefineContent<SafeRecord2<PointDiscountBody>, NormalDefaultOperation>;
	[TABLE_NAME.CRESC_LAB_SYNC_MEMBER]: SchemaDefineContent<
		SafeRecord2<CrescLabSyncMemberBody, CrescLabSyncMemberLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.GIVE_POINT_SETTING]: SchemaDefineContent<
		SafeRecord2<GivePointSettingBody, GivePointSettingLines>,
		NormalDefaultOperation,
		false,
		ExecuteDefineContent<'點數禮物卡異動', SafeRecord2<PointCardChangeArgs>, string>
	>;
	[TABLE_NAME.IMPORT_POINT]: SchemaDefineContent<SafeRecord2<ImportPointBody, ImportPointLines>, NormalDefaultOperation>;
	[TABLE_NAME.MEMBER_MERGE]: SchemaDefineContent<SafeRecord2<MemberMergeBody>, NormalDefaultOperation>;
	[TABLE_NAME.MEMBER_AUTO_ARCHIVE]: SchemaDefineContent<SafeRecord2<MemberAutoArchiveBody>, NormalDefaultOperation>;
	[TABLE_NAME.OCARD_SYNC_TASK]: SchemaDefineContent<SafeRecord2<OCardSyncTaskBody, OCardSyncTaskLines>, NormalDefaultOperation>;
	[TABLE_NAME.OCARD_SYNC_POINT_TASK]: SchemaDefineContent<
		SafeRecord2<OCardSyncPointTaskBody, OCardSyncPointTaskLines>,
		NormalDefaultOperation
	>;
	[TABLE_NAME.AUTO_UPDATE_MEMBER_CLASS]: SchemaDefineContent<SafeRecord2<AutoUpdateMemberClassBody>, NormalDefaultOperation>;
};
