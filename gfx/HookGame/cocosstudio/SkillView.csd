<GameFile>
  <PropertyGroup Name="SkillView" Type="Layer" ID="9053fd25-36c4-47db-a2f5-865d598d8b07" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Layer" Tag="303" ctype="GameLayerObjectData">
        <Size X="600.0000" Y="110.0000" />
        <Children>
          <AbstractNodeData Name="root" ActionTag="846016647" Tag="524" IconVisible="False" TouchEnable="True" BackColorAlpha="102" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="600.0000" Y="110.0000" />
            <Children>
              <AbstractNodeData Name="skillView_bg" ActionTag="1321404762" Tag="304" IconVisible="False" Scale9Enable="True" LeftEage="12" RightEage="12" TopEage="12" BottomEage="12" Scale9OriginX="12" Scale9OriginY="12" Scale9Width="7" Scale9Height="8" ctype="ImageViewObjectData">
                <Size X="600.0000" Y="110.0000" />
                <AnchorPoint />
                <Position />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="1.0000" Y="1.0000" />
                <FileData Type="MarkedSubImage" Path="heroUI/skill_bg.png" Plist="HeroUI.plist" />
              </AbstractNodeData>
              <AbstractNodeData Name="skill_icon" ActionTag="-197903211" Tag="305" IconVisible="False" LeftMargin="15.0000" RightMargin="495.0000" TopMargin="9.0000" BottomMargin="11.0000" Scale9Width="90" Scale9Height="90" ctype="ImageViewObjectData">
                <Size X="90.0000" Y="90.0000" />
                <AnchorPoint />
                <Position X="15.0000" Y="11.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.0250" Y="0.1000" />
                <PreSize X="0.1500" Y="0.8182" />
                <FileData Type="MarkedSubImage" Path="heroUI/skill_icon.png" Plist="HeroUI.plist" />
              </AbstractNodeData>
              <AbstractNodeData Name="skillName_text" ActionTag="1868296756" Tag="306" IconVisible="False" LeftMargin="118.0000" RightMargin="342.0000" TopMargin="11.0000" BottomMargin="79.0000" IsCustomSize="True" FontSize="20" LabelText="技能名称六字" VerticalAlignmentType="VT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="140.0000" Y="20.0000" />
                <AnchorPoint />
                <Position X="118.0000" Y="79.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="0" G="0" B="0" />
                <PrePosition X="0.1967" Y="0.7182" />
                <PreSize X="0.2333" Y="0.1818" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="skill_text" ActionTag="173337070" Tag="307" IconVisible="False" LeftMargin="118.3578" RightMargin="161.6422" TopMargin="35.3052" BottomMargin="14.6948" IsCustomSize="True" FontSize="14" LabelText="文本描述" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="320.0000" Y="60.0000" />
                <AnchorPoint />
                <Position X="118.3578" Y="14.6948" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="0" G="0" B="0" />
                <PrePosition X="0.1973" Y="0.1336" />
                <PreSize X="0.5333" Y="0.5455" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="lock_btn" ActionTag="55421075" Tag="661" IconVisible="True" LeftMargin="443.8899" RightMargin="16.1101" TopMargin="14.5103" BottomMargin="15.4897" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="140.0000" Y="80.0000" />
                <AnchorPoint />
                <Position X="443.8899" Y="15.4897" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.7398" Y="0.1408" />
                <PreSize X="0.2333" Y="0.7273" />
                <FileData Type="Normal" Path="Btn_Lock.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="skillLevel_text" ActionTag="-873835688" Tag="304" IconVisible="False" LeftMargin="259.8713" RightMargin="183.1287" TopMargin="11.1119" BottomMargin="78.8881" LabelText="Lv.999/999" ctype="TextBMFontObjectData">
                <Size X="157.0000" Y="20.0000" />
                <AnchorPoint ScaleY="0.5000" />
                <Position X="259.8713" Y="88.8881" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4331" Y="0.8081" />
                <PreSize X="0.2617" Y="0.1818" />
                <LabelBMFontFile_CNB Type="Normal" Path="font/white16-export.fnt" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="MaxLevel_btn" ActionTag="-917944944" Tag="667" IconVisible="True" LeftMargin="443.8899" RightMargin="16.1101" TopMargin="14.5103" BottomMargin="15.4897" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="140.0000" Y="80.0000" />
                <AnchorPoint />
                <Position X="443.8899" Y="15.4897" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.7398" Y="0.1408" />
                <PreSize X="0.2333" Y="0.7273" />
                <FileData Type="Normal" Path="Btn_MaxLevel.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="upgrade_btn" ActionTag="1170554939" Tag="687" IconVisible="True" LeftMargin="443.8899" RightMargin="16.1101" TopMargin="14.5103" BottomMargin="15.4897" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="140.0000" Y="80.0000" />
                <AnchorPoint />
                <Position X="443.8899" Y="15.4897" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.7398" Y="0.1408" />
                <PreSize X="0.2333" Y="0.7273" />
                <FileData Type="Normal" Path="Btn_Upgrade1.csd" Plist="" />
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