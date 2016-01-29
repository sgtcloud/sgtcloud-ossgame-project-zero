<GameFile>
  <PropertyGroup Name="EquipView" Type="Layer" ID="89694dc2-1e83-49cd-a473-f5f244c13c40" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Layer" Tag="205" ctype="GameLayerObjectData">
        <Size X="600.0000" Y="110.0000" />
        <Children>
          <AbstractNodeData Name="root" ActionTag="-810919168" Tag="285" IconVisible="False" TouchEnable="True" BackColorAlpha="102" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="600.0000" Y="110.0000" />
            <Children>
              <AbstractNodeData Name="equipView_bg" ActionTag="1891383320" Tag="208" IconVisible="False" Scale9Enable="True" LeftEage="12" RightEage="12" TopEage="12" BottomEage="12" Scale9OriginX="12" Scale9OriginY="12" Scale9Width="7" Scale9Height="8" ctype="ImageViewObjectData">
                <Size X="600.0000" Y="110.0000" />
                <AnchorPoint />
                <Position />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="1.0000" Y="1.0000" />
                <FileData Type="Normal" Path="equipUI/equip_bg.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="equip_icon" ActionTag="1359261642" Tag="24" IconVisible="False" LeftMargin="15.0000" RightMargin="495.0000" TopMargin="10.0000" BottomMargin="10.0000" Scale9Width="90" Scale9Height="90" ctype="ImageViewObjectData">
                <Size X="90.0000" Y="90.0000" />
                <AnchorPoint />
                <Position X="15.0000" Y="10.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.0250" Y="0.0909" />
                <PreSize X="0.1500" Y="0.8182" />
                <FileData Type="Normal" Path="equipUI/equip_icon.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="equipName_text" ActionTag="-2094451360" Tag="44" IconVisible="False" LeftMargin="115.7146" RightMargin="304.2854" TopMargin="13.5001" BottomMargin="76.4999" IsCustomSize="True" FontSize="20" LabelText="神器名字六字" VerticalAlignmentType="VT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="180.0000" Y="20.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="115.7146" Y="86.4999" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="0" G="0" B="0" />
                <PrePosition X="0.1929" Y="0.7864" />
                <PreSize X="0.3000" Y="0.1818" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="equipBuffDecs_text" ActionTag="-1671372399" Tag="46" IconVisible="False" LeftMargin="115.7145" RightMargin="164.2855" TopMargin="38.6161" BottomMargin="11.3839" IsCustomSize="True" FontSize="18" LabelText="神器效果详细描述" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="320.0000" Y="60.0000" />
                <AnchorPoint ScaleY="1.0000" />
                <Position X="115.7145" Y="71.3839" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="0" G="0" B="0" />
                <PrePosition X="0.1929" Y="0.6489" />
                <PreSize X="0.5333" Y="0.5455" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="equipLevel_text" ActionTag="1417978744" Tag="1093" IconVisible="False" LeftMargin="306.0510" RightMargin="210.9490" TopMargin="17.0813" BottomMargin="77.9187" LabelText="Lv.99/99" ctype="TextBMFontObjectData">
                <Size X="83.0000" Y="15.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="306.0510" Y="85.4187" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5101" Y="0.7765" />
                <PreSize X="0.1383" Y="0.1364" />
                <LabelBMFontFile_CNB Type="Normal" Path="font/font16_white_kmbb-export.fnt" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="upgrade_btn" ActionTag="-936342614" Tag="714" IconVisible="True" LeftMargin="442.5508" RightMargin="17.4492" TopMargin="13.6489" BottomMargin="16.3511" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="140.0000" Y="80.0000" />
                <AnchorPoint />
                <Position X="442.5508" Y="16.3511" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.7376" Y="0.1486" />
                <PreSize X="0.2333" Y="0.7273" />
                <FileData Type="Normal" Path="Btn_Upgrade2.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="MaxLevel_btn" Visible="False" ActionTag="905642592" Tag="723" IconVisible="True" LeftMargin="442.5508" RightMargin="17.4492" TopMargin="13.6490" BottomMargin="16.3510" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="140.0000" Y="80.0000" />
                <AnchorPoint />
                <Position X="442.5508" Y="16.3510" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.7376" Y="0.1486" />
                <PreSize X="0.2333" Y="0.7273" />
                <FileData Type="Normal" Path="Btn_MaxLevel.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="lock_btn" Visible="False" ActionTag="-1077941742" Tag="196" IconVisible="True" LeftMargin="442.8716" RightMargin="17.1284" TopMargin="13.6806" BottomMargin="16.3194" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="140.0000" Y="80.0000" />
                <AnchorPoint />
                <Position X="442.8716" Y="16.3194" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.7381" Y="0.1484" />
                <PreSize X="0.2333" Y="0.7273" />
                <FileData Type="Normal" Path="Btn_Lock.csd" Plist="" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="1.0000" Y="1.0000" />
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