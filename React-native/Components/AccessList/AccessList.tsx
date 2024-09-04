import React, {useContext} from 'react';
import {Text} from 'react-native';
import {useThemeBasedOnSchema} from '../../context/theme/useTheme';
import {ToastContext} from '../../context/toast/toast.context';
import {CommunityMemberModel} from '../../models/community-member.model';
import {UserAction} from './UserAction';
import {AccessListStyle} from './AccessList.style';

export const enum TABTYPE {
  EDIT = 'edit',
  DELETE = 'delete',
  DEFAULT = 'default',
}

const AccessList = ({
  users,
  title,
  type,
  goToProfile,
  editUserAccess,
  deleteUserAccess,
  count,
}: {
  users: CommunityMemberModel[];
  title: string;
  type: TABTYPE;
  goToProfile: Function;
  editUserAccess: Function;
  deleteUserAccess: Function;
  count: number;
}) => {
  const {style, theme} = useThemeBasedOnSchema();
  const styles = AccessListStyle(style, theme);

  const {setToast} = useContext(ToastContext);
  return (
    <>
      {count > 0 && title && (
        <Text style={styles.caption}>
          {title} {'(' + count + (count > 1 ? ' MEMBERS)' : ' MEMBER)')}
        </Text>
      )}
      {users.map(user => {
        return (
          <UserAction
            key={user.id}
            user={user.user}
            goToProfile={goToProfile}
            editClicked={() => {
              if (user.isSpeaker) {
                setToast(
                  `${user.user.username} is current speaker.\nTo change the access level, first select a different speaker`,
                );
                return;
              }
              type === TABTYPE.DELETE
                ? deleteUserAccess(user)
                : editUserAccess(user);
            }}
            type={type}
          />
        );
      })}
    </>
  );
};
export default AccessList;
