import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import Header from '../../layout/header';
import { useAuthContext } from '../../contexts/auth.context';

const SettingScreen = () => {
  const { storeInfo, userToken, openTokenOverlay } = useAuthContext();

  useEffect(() => {
    if (!userToken) {
      openTokenOverlay('MENU');
      return;
    }
  }, []);

  return (
    <>
      <Header hasMenu />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Location Information:</Text>
            <View style={styles.location}>
            <View style={styles.locationItem}>
                <TextInput
                  placeholder='Store Name'
                  style={styles.locationInput}
                  value={storeInfo?.name||''}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>
              <View style={styles.locationItem}>
                <TextInput
                  placeholder='Address'
                  style={styles.locationInput}
                  value={storeInfo?.storeInfo?.address}
                  editable={false}
                  selectTextOnFocus={false}
                />
                <TextInput
                  placeholder='City'
                  style={styles.locationInput}
                  value={storeInfo?.storeInfo?.city}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>
              <View style={styles.locationItem}>
                <TextInput
                  placeholder='State'
                  style={styles.locationInput}
                  value={storeInfo?.storeInfo?.state}
                  editable={false}
                  selectTextOnFocus={false}
                />
                <TextInput
                  placeholder='Zip'
                  style={styles.locationInput}
                  value={storeInfo?.storeInfo?.zip}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>
              <View style={styles.locationItem}>
                <TextInput
                  placeholder='Phone Number'
                  style={styles.locationInput}
                  value={storeInfo?.contactInfo?.phone}
                  editable={false}
                  selectTextOnFocus={false}
                />
                <TextInput
                  placeholder='Phone Number'
                  style={[styles.locationInput, {opacity: 0}]}
                  editable={false}
                />
              </View>
            </View>
            <Text style={styles.subtitle}>Store ID:</Text>
            <View style={styles.location}>
              <View style={styles.locationItem}>
                <TextInput
                  placeholder='Store ID'
                  style={styles.locationInput}
                  value={storeInfo?.storeId||''}
                  editable={false}
                  selectTextOnFocus={false}
                />
                <TextInput
                  placeholder='Phone Number'
                  style={[styles.locationInput, {opacity: 0}]}
                  editable={false}
                />
              </View>
            </View>
            <Text style={styles.subtitle}>Tip Settings:</Text>
            <View style={styles.tip}>
              { storeInfo?.noTip ? 
                <TouchableOpacity style={styles.tipItem}>
                <Text style={styles.tipItemText}>
                  No Tip
                </Text>
              </TouchableOpacity>
              : <>
                <TouchableOpacity style={styles.tipItem}>
                  <Text style={styles.tipItemText}>
                    {storeInfo?.tipAmounts[0] ?? 0}
                    {storeInfo?.tipMode === 'percentage' ? '%' : '$'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tipItem}>
                  <Text style={styles.tipItemText}>
                    {storeInfo?.tipAmounts[1] ?? 0}
                    {storeInfo?.tipMode === 'percentage' ? '%' : '$'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tipItem}>
                  <Text style={styles.tipItemText}>
                    {storeInfo?.tipAmounts[2] ?? 0}
                    {storeInfo?.tipMode === 'percentage' ? '%' : '$'}
                  </Text>
                </TouchableOpacity>
              </>
              }
            </View>
            <Text style={styles.subtitle}>Convenience Fee:</Text>
            <View style={styles.tip}>
              <TouchableOpacity style={styles.tipItem}>
                <Text style={styles.tipItemText}>
                  {
                    (storeInfo?.noConvenienceFee && 'No Convenience Fee')
                  }
                  {
                    (storeInfo?.percentageFeeMode ? storeInfo?.percentageFeeAmount + '%' : '')
                  }
                  {
                    storeInfo?.percentageFeeMode && storeInfo?.fixedFeeMode && ' + '
                  }
                  {
                    (storeInfo?.fixedFeeMode ? storeInfo?.fixedFeeAmount + '$' : '')
                  }
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>Processing Fee:</Text>
            <View style={styles.tip}>
              <TouchableOpacity style={styles.tipItem}>
                <Text style={styles.tipItemText}>
                  {
                    (storeInfo?.percentageProcessingFeeMode ? storeInfo?.percentageProcessingFeeAmount + '%' : '')
                  }
                  {
                    storeInfo?.percentageProcessingFeeMode && storeInfo?.fixedProcessingFeeMode && ' + '
                  }
                  {
                    (storeInfo?.fixedProcessingFeeMode ? storeInfo?.fixedProcessingFeeAmount + '$' : '')
                  }
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>Auto Batch:</Text>
            <View style={styles.batch}>
              <View style={styles.batchItem}>
                <Text style={styles.batchText}>Time - 4am EST, daily</Text>
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity style={[styles.tipItem, storeInfo?.isAutoBatchTime ? {borderRadius: 10} : styles.batchButton]}>
                  <Text style={[styles.tipItemText, storeInfo?.isAutoBatchTime === false && {color: 'black'}]}>Yes</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity style={[styles.tipItem, storeInfo?.isAutoBatchTime ? styles.batchButton : {borderRadius: 10}]}>
                  <Text style={[styles.tipItemText, storeInfo?.isAutoBatchTime && {color: 'black'}]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.subtitle}>Last 4 digits of Bank:</Text>
            <View style={[styles.location, styles.locationItem]}>
              <TextInput 
                placeholder='XXXX XXXX XXXX 4242'
                style={[styles.locationInput, {textAlign: 'center'}]}
                value={storeInfo?.bankInfo?.accountNumber && storeInfo?.bankInfo?.accountNumber.slice(-4)}
                editable={false}
                selectTextOnFocus={false}
              />
            </View>
            <Text style={styles.subtitle}>Descriptor:</Text>
            <View style={[styles.location, styles.locationItem]}>
              <TextInput
                placeholder='Descriptor'
                style={[styles.locationInput, {textAlign: 'center'}]}
                value={storeInfo?.merchant?.descriptor}
                editable={false}
                selectTextOnFocus={false}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 24,
    backgroundColor: '#F3F3F3',
    flex: 1,
    minHeight: '100%'
  },
  content: {
    borderRadius: 15,
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 0
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    color: 'black',
    fontFamily: 'Poppins',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 30,
    color: 'black',
    fontFamily: 'Poppins',
  },
  location: {
    gap: 10,
    marginTop: 10,
    marginBottom: 18
  },
  locationItem: {
    flexDirection: 'row',
    gap: 16
  },
  locationInput: {
    borderRadius: 15,
    backgroundColor: '#F3F3F3',
    lineHeight: 20,
    paddingVertical: 7,
    paddingHorizontal: 20,
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '300',
    flex: 1
  },
  tip: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 10,
    marginBottom: 18
  },
  tipItem: {
    flex: 1,
    backgroundColor: '#5B913B',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 20
  },
  tipItemText: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '500',
    lineHeight: 20
  },
  batch: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 18,
    gap: 8
  },
  batchItem: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  batchText: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontStyle: 'italic'
  },
  batchButton: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10
  }
});

export default SettingScreen;
