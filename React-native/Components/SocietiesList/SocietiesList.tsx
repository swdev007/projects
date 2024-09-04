import React, {useMemo} from 'react';
import {Image, Text, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useThemeBasedOnSchema} from '../../context/theme/useTheme';
import {CommunityMembershipModel} from '../../models/community-membership.model';
import {ShortCommunityModel} from '../../models/short-community.model';
import {HomeConversationState} from '../../types-interfaces/home-conversation-state.type';
import AddNewSociety from '../add-new-society/AddNewSocity';
import CommunityCard from '../community-card/CommunityCard';
import LockedCommunityCard from '../community-card/LockedCommunityCard';
import {SocietiesListStyle} from './SocietiesList.style';

export interface SocietiesListProps {
  list: CommunityMembershipModel[];
  children: JSX.Element;
  lockedCampusGroup: ShortCommunityModel | null;
}

enum SocietyItemType {
  MEMBERSHIP = 'MEMBERSHIP',
  LOCKED_COMMUNITY = 'LOCKED_COMMUNITY',
}

export interface SocietyList {
  type: SocietyItemType;
  membership?: CommunityMembershipModel;
  community?: ShortCommunityModel;
}

const SocietiesList = ({
  list,
  children,
  lockedCampusGroup,
}: SocietiesListProps) => {
  const {style, theme} = useThemeBasedOnSchema();
  const styles = SocietiesListStyle(style, theme);

  const updatedListForMembership: SocietyList[] = useMemo(() => {
    if (!lockedCampusGroup) {
      return list.map((membership: CommunityMembershipModel) => {
        return {type: SocietyItemType.MEMBERSHIP, membership};
      });
    }

    const withTimer: SocietyList[] = [];
    const withoutTimer: SocietyList[] = [];

    list.forEach((membership: CommunityMembershipModel) => {
      if (
        (membership.community.conversationState === 'INTERMISSION' &&
          membership.isSpeaker) ||
        (membership.community.conversationState === 'LIVE' &&
          membership.homeConversationState === HomeConversationState.SPEAKER) ||
        (membership.community.conversationState === 'LIVE' &&
          membership.community.nextEventAt)
      ) {
        withTimer.push({type: SocietyItemType.MEMBERSHIP, membership});
      } else {
        withoutTimer.push({type: SocietyItemType.MEMBERSHIP, membership});
      }
    });

    return [
      ...withTimer,
      {type: SocietyItemType.LOCKED_COMMUNITY, community: lockedCampusGroup},
      ...withoutTimer,
    ];
  }, [list, lockedCampusGroup]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Societies</Text>
      <FlatList
        data={updatedListForMembership}
        horizontal={true}
        style={styles.list}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}: {item: SocietyList}) => {
          if (
            item.type === SocietyItemType.LOCKED_COMMUNITY &&
            item.community
          ) {
            return <LockedCommunityCard shortCommunity={item.community} />;
          } else if (item.membership) {
            return <CommunityCard membership={item.membership} key={item.id} />;
          } else {
            return <></>;
          }
        }}
        ListFooterComponent={
          <AddNewSociety>
            <View style={styles.addWrap}>
              <View style={styles.addIconWrap}>
                <Image style={styles.addIcon} source={theme.icon.addIconBig} />
              </View>
              <Text style={styles.addText}>{`Create\nSociety`}</Text>
            </View>
          </AddNewSociety>
        }
      />
      {children}
    </View>
  );
};
export default SocietiesList;
