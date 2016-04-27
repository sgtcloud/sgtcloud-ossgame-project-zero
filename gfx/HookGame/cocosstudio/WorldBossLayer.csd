<GameFile>
  <PropertyGroup Name="WorldBossLayer" Type="Layer" ID="8d0b323c-d865-4ed7-8918-5431a2e60389" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Layer" Tag="121" ctype="GameLayerObjectData">
        <Size X="600.0000" Y="600.0000" />
        <Children>
          <AbstractNodeData Name="root" ActionTag="-468367094" Tag="122" IconVisible="False" TouchEnable="True" BackColorAlpha="102" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Enable="True" LeftEage="13" RightEage="13" TopEage="13" BottomEage="13" Scale9OriginX="13" Scale9OriginY="13" Scale9Width="5" Scale9Height="6" ctype="PanelObjectData">
            <Size X="600.0000" Y="600.0000" />
            <Children>
              <AbstractNodeData Name="pic_bg" ActionTag="2117502016" Tag="150" IconVisible="False" LeftMargin="21.1941" RightMargin="18.8059" TopMargin="103.5104" BottomMargin="196.4896" Scale9Enable="True" LeftEage="9" RightEage="9" TopEage="11" BottomEage="11" Scale9OriginX="9" Scale9OriginY="11" Scale9Width="10" Scale9Height="14" ctype="ImageViewObjectData">
                <Size X="560.0000" Y="300.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="301.1941" Y="346.4896" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5020" Y="0.5775" />
                <PreSize X="0.9333" Y="0.5000" />
                <FileData Type="Normal" Path="mainUI/bg_03.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="pic" ActionTag="1793057944" CallBackType="Touch" Tag="46" IconVisible="False" LeftMargin="29.0046" RightMargin="26.9954" TopMargin="109.0010" BottomMargin="206.9990" Scale9Width="487" Scale9Height="286" ctype="ImageViewObjectData">
                <Size X="544.0000" Y="284.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="301.0046" Y="348.9990" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5017" Y="0.5817" />
                <PreSize X="0.9067" Y="0.4733" />
                <FileData Type="Normal" Path="worldBossUI/pic.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="bar" ActionTag="-1138535894" Tag="47" IconVisible="False" LeftMargin="79.9994" RightMargin="80.0006" TopMargin="301.0000" BottomMargin="219.0000" TouchEnable="True" BackColorAlpha="102" ColorAngle="90.0000" ctype="PanelObjectData">
                <Size X="440.0000" Y="80.0000" />
                <Children>
                  <AbstractNodeData Name="hp_bg" ActionTag="513608702" Tag="48" IconVisible="False" TopMargin="18.0000" BottomMargin="30.0000" Scale9Width="440" Scale9Height="32" ctype="ImageViewObjectData">
                    <Size X="440.0000" Y="32.0000" />
                    <AnchorPoint />
                    <Position Y="30.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition Y="0.3750" />
                    <PreSize X="1.0000" Y="0.4000" />
                    <FileData Type="Normal" Path="worldBossUI/hp_bg.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="time_bg" ActionTag="144810928" Tag="49" IconVisible="False" TopMargin="48.0000" Scale9Width="440" Scale9Height="32" ctype="ImageViewObjectData">
                    <Size X="440.0000" Y="32.0000" />
                    <AnchorPoint />
                    <Position />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="1.0000" Y="0.4000" />
                    <FileData Type="Normal" Path="worldBossUI/time_bg.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="hp_bar" ActionTag="919618712" Tag="50" IconVisible="False" LeftMargin="59.5269" RightMargin="4.4731" TopMargin="13.3204" BottomMargin="28.6796" ProgressInfo="100" ctype="LoadingBarObjectData">
                    <Size X="376.0000" Y="38.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="247.5269" Y="47.6796" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5626" Y="0.5960" />
                    <PreSize X="0.8545" Y="0.4750" />
                    <ImageFileData Type="Normal" Path="worldBossUI/hp_bar.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="time_bar" ActionTag="1086742958" Tag="51" IconVisible="False" LeftMargin="51.3157" RightMargin="-1.3157" TopMargin="43.2840" BottomMargin="-1.2840" ProgressInfo="100" ctype="LoadingBarObjectData">
                    <Size X="390.0000" Y="38.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="246.3157" Y="17.7160" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5598" Y="0.2214" />
                    <PreSize X="0.8864" Y="0.4750" />
                    <ImageFileData Type="Normal" Path="worldBossUI/time_bar.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="hp_num" ActionTag="206909644" Tag="160" IconVisible="False" LeftMargin="280.0043" RightMargin="14.9957" TopMargin="22.3565" BottomMargin="39.6435" LabelText="999999999" ctype="TextBMFontObjectData">
                    <Size X="145.0000" Y="18.0000" />
                    <AnchorPoint ScaleX="1.0000" ScaleY="0.5000" />
                    <Position X="425.0043" Y="48.6435" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.9659" Y="0.6080" />
                    <PreSize X="0.3295" Y="0.2250" />
                    <LabelBMFontFile_CNB Type="Normal" Path="font/white14-export.fnt" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="time_num" ActionTag="-771060913" Tag="161" IconVisible="False" LeftMargin="356.0043" RightMargin="14.9957" TopMargin="52.4534" BottomMargin="9.5466" LabelText="99:99" ctype="TextBMFontObjectData">
                    <Size X="69.0000" Y="18.0000" />
                    <AnchorPoint ScaleX="1.0000" ScaleY="0.5000" />
                    <Position X="425.0043" Y="18.5466" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.9659" Y="0.2318" />
                    <PreSize X="0.1568" Y="0.2250" />
                    <LabelBMFontFile_CNB Type="Normal" Path="font/white14-export.fnt" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint />
                <Position X="79.9994" Y="219.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.1333" Y="0.3650" />
                <PreSize X="0.7333" Y="0.1333" />
                <SingleColor A="255" R="150" G="200" B="255" />
                <FirstColor A="255" R="150" G="200" B="255" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="text" Visible="False" ActionTag="2141578675" Tag="52" IconVisible="False" LeftMargin="82.4180" RightMargin="77.5820" TopMargin="298.1188" BottomMargin="221.8812" TouchEnable="True" BackColorAlpha="102" ColorAngle="90.0000" ctype="PanelObjectData">
                <Size X="440.0000" Y="80.0000" />
                <Children>
                  <AbstractNodeData Name="text" ActionTag="1387900353" Tag="53" IconVisible="False" IsCustomSize="True" FontSize="20" LabelText="世界Boss开启时间：每日12:00、18:00&#xA;击杀Boss获得丰厚奖励！" HorizontalAlignmentType="HT_Center" VerticalAlignmentType="VT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="440.0000" Y="80.0000" />
                    <AnchorPoint ScaleY="1.0000" />
                    <Position Y="80.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition Y="1.0000" />
                    <PreSize X="1.0000" Y="1.0000" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint />
                <Position X="82.4180" Y="221.8812" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.1374" Y="0.3698" />
                <PreSize X="0.7333" Y="0.1333" />
                <SingleColor A="255" R="150" G="200" B="255" />
                <FirstColor A="255" R="150" G="200" B="255" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="dekaron_btn" ActionTag="-1703561067" Tag="55" IconVisible="False" LeftMargin="194.8229" RightMargin="194.1771" TopMargin="498.4643" BottomMargin="16.5357" TouchEnable="True" BackColorAlpha="102" ColorAngle="90.0000" ctype="PanelObjectData">
                <Size X="211.0000" Y="85.0000" />
                <Children>
                  <AbstractNodeData Name="btn" ActionTag="691209561" Tag="56" IconVisible="False" LeftMargin="-0.7294" RightMargin="0.7294" TopMargin="0.7294" BottomMargin="-0.7294" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="181" Scale9Height="63" DisplayState="False" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="211.0000" Y="85.0000" />
                    <AnchorPoint />
                    <Position X="-0.7294" Y="-0.7294" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="-0.0035" Y="-0.0086" />
                    <PreSize X="1.0000" Y="1.0000" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Normal" Path="worldBossUI/btn_2.png" Plist="" />
                    <PressedFileData Type="Normal" Path="worldBossUI/btn_1.png" Plist="" />
                    <NormalFileData Type="Normal" Path="worldBossUI/btn_1.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="dekaron_text" Visible="False" ActionTag="-271874441" Tag="57" IconVisible="False" LeftMargin="54.4649" RightMargin="58.5351" TopMargin="19.1550" BottomMargin="15.8450" Scale9Width="98" Scale9Height="50" ctype="ImageViewObjectData">
                    <Size X="98.0000" Y="50.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="103.4649" Y="40.8450" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.4904" Y="0.4805" />
                    <PreSize X="0.4645" Y="0.5882" />
                    <FileData Type="Normal" Path="worldBossUI/dekaron.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="cd_text" ActionTag="117749452" Tag="58" IconVisible="False" LeftMargin="59.1458" RightMargin="58.8542" TopMargin="13.8752" BottomMargin="42.1248" Scale9Width="93" Scale9Height="29" ctype="ImageViewObjectData">
                    <Size X="93.0000" Y="29.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="105.6458" Y="56.6248" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5007" Y="0.6662" />
                    <PreSize X="0.4408" Y="0.3412" />
                    <FileData Type="Normal" Path="worldBossUI/cd.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="s_text" ActionTag="133738511" Tag="59" IconVisible="False" LeftMargin="119.2868" RightMargin="72.7132" TopMargin="49.7228" BottomMargin="17.2772" Scale9Width="19" Scale9Height="18" ctype="ImageViewObjectData">
                    <Size X="19.0000" Y="18.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="128.7868" Y="26.2772" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.6104" Y="0.3091" />
                    <PreSize X="0.0900" Y="0.2118" />
                    <FileData Type="Normal" Path="worldBossUI/s.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="time_num" ActionTag="374452935" Tag="60" IconVisible="False" LeftMargin="62.7999" RightMargin="93.2001" TopMargin="46.2200" BottomMargin="18.7800" LabelText="999" ctype="TextBMFontObjectData">
                    <Size X="55.0000" Y="20.0000" />
                    <AnchorPoint ScaleX="1.0000" ScaleY="0.5000" />
                    <Position X="117.7999" Y="28.7800" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="0" B="0" />
                    <PrePosition X="0.5583" Y="0.3386" />
                    <PreSize X="0.2607" Y="0.2353" />
                    <LabelBMFontFile_CNB Type="Normal" Path="font/white16-export.fnt" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint />
                <Position X="194.8229" Y="16.5357" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.3247" Y="0.0276" />
                <PreSize X="0.3517" Y="0.1417" />
                <SingleColor A="255" R="150" G="200" B="255" />
                <FirstColor A="255" R="150" G="200" B="255" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="inspire_btn" ActionTag="-918372876" Tag="61" IconVisible="False" LeftMargin="81.5276" RightMargin="398.4724" TopMargin="416.7345" BottomMargin="103.2655" TouchEnable="True" BackColorAlpha="102" ColorAngle="90.0000" ctype="PanelObjectData">
                <Size X="120.0000" Y="80.0000" />
                <Children>
                  <AbstractNodeData Name="btn" ActionTag="1302993319" Tag="62" IconVisible="False" TopMargin="33.0000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="14" RightEage="14" TopEage="14" BottomEage="14" Scale9OriginX="14" Scale9OriginY="14" Scale9Width="4" Scale9Height="19" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="120.0000" Y="47.0000" />
                    <AnchorPoint />
                    <Position />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="1.0000" Y="0.5875" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Normal" Path="mainUI/bg_14_2.png" Plist="" />
                    <PressedFileData Type="Normal" Path="mainUI/bg_14.png" Plist="" />
                    <NormalFileData Type="Normal" Path="mainUI/bg_14.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="inspire_text" ActionTag="8972443" Tag="63" IconVisible="False" LeftMargin="26.7368" RightMargin="33.2632" TopMargin="39.4094" BottomMargin="5.5906" Scale9Width="60" Scale9Height="35" ctype="ImageViewObjectData">
                    <Size X="60.0000" Y="35.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="56.7368" Y="23.0906" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.4728" Y="0.2886" />
                    <PreSize X="0.5000" Y="0.4375" />
                    <FileData Type="Normal" Path="worldBossUI/inspire.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="icon" ActionTag="725713398" Tag="67" IconVisible="False" LeftMargin="23.0218" RightMargin="76.9782" TopMargin="6.0881" BottomMargin="53.9119" Scale9Width="40" Scale9Height="40" ctype="ImageViewObjectData">
                    <Size X="20.0000" Y="20.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="33.0218" Y="63.9119" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.2752" Y="0.7989" />
                    <PreSize X="0.1667" Y="0.2500" />
                    <FileData Type="Normal" Path="mainUI/diamond.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="num" ActionTag="-1523283027" Tag="68" IconVisible="False" LeftMargin="50.3678" RightMargin="32.6322" TopMargin="6.6207" BottomMargin="53.3793" LabelText="99" ctype="TextBMFontObjectData">
                    <Size X="37.0000" Y="20.0000" />
                    <AnchorPoint ScaleY="0.5000" />
                    <Position X="50.3678" Y="63.3793" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.4197" Y="0.7922" />
                    <PreSize X="0.3083" Y="0.2500" />
                    <LabelBMFontFile_CNB Type="Normal" Path="font/white16-export.fnt" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint />
                <Position X="81.5276" Y="103.2655" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.1359" Y="0.1721" />
                <PreSize X="0.2000" Y="0.1333" />
                <SingleColor A="255" R="150" G="200" B="255" />
                <FirstColor A="255" R="150" G="200" B="255" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="now_btn" ActionTag="150531996" Tag="69" IconVisible="False" LeftMargin="404.6917" RightMargin="75.3083" TopMargin="419.2806" BottomMargin="100.7193" TouchEnable="True" BackColorAlpha="102" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
                <Size X="120.0000" Y="80.0000" />
                <Children>
                  <AbstractNodeData Name="btn" ActionTag="1716855766" Tag="70" IconVisible="False" TopMargin="33.0000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="14" RightEage="14" TopEage="14" BottomEage="14" Scale9OriginX="14" Scale9OriginY="14" Scale9Width="4" Scale9Height="19" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="120.0000" Y="47.0000" />
                    <AnchorPoint />
                    <Position />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="1.0000" Y="0.5875" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Normal" Path="mainUI/bg_14_2.png" Plist="" />
                    <PressedFileData Type="Normal" Path="mainUI/bg_14.png" Plist="" />
                    <NormalFileData Type="Normal" Path="mainUI/bg_14.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="now_text" ActionTag="-1979423208" Tag="71" IconVisible="False" LeftMargin="1.2367" RightMargin="3.7633" TopMargin="38.4095" BottomMargin="6.5905" Scale9Width="115" Scale9Height="35" ctype="ImageViewObjectData">
                    <Size X="115.0000" Y="35.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="58.7367" Y="24.0905" />
                    <Scale ScaleX="0.9000" ScaleY="0.9000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.4895" Y="0.3011" />
                    <PreSize X="0.9583" Y="0.4375" />
                    <FileData Type="Normal" Path="worldBossUI/now.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="icon" ActionTag="-2127429865" Tag="72" IconVisible="False" LeftMargin="23.0218" RightMargin="76.9782" TopMargin="6.0881" BottomMargin="53.9119" Scale9Width="40" Scale9Height="40" ctype="ImageViewObjectData">
                    <Size X="20.0000" Y="20.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="33.0218" Y="63.9119" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.2752" Y="0.7989" />
                    <PreSize X="0.1667" Y="0.2500" />
                    <FileData Type="Normal" Path="mainUI/diamond.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="num" ActionTag="-1060980147" Tag="73" IconVisible="False" LeftMargin="50.3678" RightMargin="32.6322" TopMargin="6.6207" BottomMargin="53.3793" LabelText="99" ctype="TextBMFontObjectData">
                    <Size X="37.0000" Y="20.0000" />
                    <AnchorPoint ScaleY="0.5000" />
                    <Position X="50.3678" Y="63.3793" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.4197" Y="0.7922" />
                    <PreSize X="0.3083" Y="0.2500" />
                    <LabelBMFontFile_CNB Type="Normal" Path="font/white16-export.fnt" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint />
                <Position X="404.6917" Y="100.7193" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.6745" Y="0.1679" />
                <PreSize X="0.2000" Y="0.1333" />
                <SingleColor A="255" R="150" G="200" B="255" />
                <FirstColor A="255" R="150" G="200" B="255" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="close_btn" ActionTag="-1583415698" Tag="77" IconVisible="True" LeftMargin="554.2318" RightMargin="-10.2318" TopMargin="-19.2566" BottomMargin="561.2566" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="56.0000" Y="58.0000" />
                <AnchorPoint />
                <Position X="554.2318" Y="561.2566" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.9237" Y="0.9354" />
                <PreSize X="0.0933" Y="0.0967" />
                <FileData Type="Normal" Path="CloseBtn.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="reward_btn" ActionTag="1270518119" Tag="76" IconVisible="False" LeftMargin="485.9988" RightMargin="24.0012" TopMargin="107.4995" BottomMargin="423.5005" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="60" Scale9Height="47" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="90.0000" Y="69.0000" />
                <AnchorPoint ScaleX="-1.3085" ScaleY="2.4458" />
                <Position X="368.2322" Y="592.2578" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.6137" Y="0.9871" />
                <PreSize X="0.1500" Y="0.1150" />
                <TextColor A="255" R="65" G="65" B="70" />
                <DisabledFileData Type="Normal" Path="worldBossUI/reward_btn.png" Plist="" />
                <PressedFileData Type="Normal" Path="worldBossUI/reward_btn.png" Plist="" />
                <NormalFileData Type="Normal" Path="worldBossUI/reward_btn.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="title_bg" ActionTag="-159881552" Tag="81" IconVisible="False" LeftMargin="122.9994" RightMargin="117.0006" TopMargin="17.9960" BottomMargin="512.0040" Scale9Width="123" Scale9Height="42" ctype="ImageViewObjectData">
                <Size X="360.0000" Y="70.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="302.9994" Y="547.0040" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5050" Y="0.9117" />
                <PreSize X="0.6000" Y="0.1167" />
                <FileData Type="Normal" Path="mainUI/title_bg4.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="title" ActionTag="-600752532" Tag="82" IconVisible="False" LeftMargin="182.4991" RightMargin="180.5009" TopMargin="17.9936" BottomMargin="524.0064" Scale9Width="237" Scale9Height="58" ctype="ImageViewObjectData">
                <Size X="237.0000" Y="58.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="300.9991" Y="553.0064" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5017" Y="0.9217" />
                <PreSize X="0.3950" Y="0.0967" />
                <FileData Type="Normal" Path="worldBossUI/title.png" Plist="" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="1.0000" Y="1.0000" />
            <FileData Type="Normal" Path="mainUI/bg_04.png" Plist="" />
            <SingleColor A="255" R="150" G="200" B="255" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>